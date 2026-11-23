
import mongoose from 'mongoose';
import { connectDatabase } from '../config/mongodb.js';
import { postgresPool as pool } from '../config/postgres.js';
import { Order } from '../models/mongoose-models/order-model.js';
import { logger } from '../libs/logger.js';

const TOTAL_ORDERS = 50000;
const BATCH_SIZE = 1000;

const PRIORITIES = ['low', 'normal', 'high'];
const CHANNELS = ['web', 'app'];

const ITEM_STATUSES = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

const ORDER_STATUSES = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Partially Shipped',
  'Partially Delivered',
];

function getItemCount(index) {
  return (index % 4) + 1;
}

function getItemStatus(orderIndex, itemIndex) {
  return ITEM_STATUSES[
    (orderIndex + itemIndex) % ITEM_STATUSES.length
  ];
}

function getOrderStatus(items) {
  const statuses = items.map(item => item.status);

  const shippedCount = statuses.filter(
    status => status === 'Shipped' || status === 'Delivered'
  ).length;

  const deliveredCount = statuses.filter(
    status => status === 'Delivered'
  ).length;

  if (deliveredCount === statuses.length) {
    return 'Delivered';
  }

  if (deliveredCount > 0) {
    return 'Partially Delivered';
  }

  if (shippedCount === statuses.length) {
    return 'Shipped';
  }

  if (shippedCount > 0) {
    return 'Partially Shipped';
  }

  if (statuses.every(status => status === 'Cancelled')) {
    return 'Cancelled';
  }

  if (statuses.every(status => status === 'Pending')) {
    return 'Pending';
  }

  return 'Processing';
}

async function getSellerPickupAddresses() {
  const result = await pool.query(`
    SELECT
      s.seller_id,
      s.name,
      pa.address_id,
      pa.pickup_label,
      pa.address,
      pa.city,
      pa.pincode
    FROM sellers s
    INNER JOIN pickup_addresses pa
      ON pa.seller_id = s.seller_id
    ORDER BY s.seller_id, pa.address_id
  `);

  if (result.rows.length === 0) {
    throw new Error(
      'No sellers with pickup addresses found in PostgreSQL.'
    );
  }

  // Group pickup addresses by seller.
  const sellersMap = new Map();

  for (const row of result.rows) {
    if (!sellersMap.has(row.seller_id)) {
      sellersMap.set(row.seller_id, {
        sellerId: row.seller_id,
        name: row.seller_name,
        addresses: [],
      });
    }

    sellersMap.get(row.seller_id).addresses.push({
      addressId: row.address_id,
      label: row.pickup_label,
      address: row.address,
      city: row.city,
      pincode: row.pincode,
    });
  }

  return [...sellersMap.values()];
}

function createOrder(index, sellers) {
  const orderId = index + 1;

  const itemCount = getItemCount(index);

  const items = [];

  for (let j = 0; j < itemCount; j++) {
    // Rotate sellers and addresses deterministically.
    const seller = sellers[
      (index + j) % sellers.length
    ];

    const pickupAddress = seller.addresses[
      (index + j) % seller.addresses.length
    ];

    const status = getItemStatus(index, j);

    items.push({
      name: `Product ${orderId}-${j + 1}`,
      type: ['Electronics', 'Clothing', 'Accessories', 'Home'][
        (index + j) % 4
      ],

      sellerId: String(seller.sellerId),

      pickUpAdress: {
        id: `PICKUP-${orderId}-${j + 1}`,
        pickUpAdressId: String(pickupAddress.addressId),
        seller_id: String(seller.sellerId),
        label: pickupAddress.label,
        city: pickupAddress.city,
        address: pickupAddress.address,
        pincode: pickupAddress.pincode,
      },

      status,
    });
  }

  return {
    id: `ORD-${String(orderId).padStart(6, '0')}`,

    customer: `Customer ${orderId}`,

    status: getOrderStatus(items),

    priority: PRIORITIES[index % PRIORITIES.length],

    channel: CHANNELS[index % CHANNELS.length],

    createdAt: new Date(
      Date.now() - index * 60_000
    ),

    items,
  };
}

async function seedOrders() {
  try {
    await connectDatabase();

    logger.debug('Fetching sellers and pickup addresses...');

    const sellers = await getSellerPickupAddresses();

    logger.debug(`Found ${sellers.length} sellers.`);

    const existingCount = await Order.countDocuments();

    if (existingCount > 0) {
      logger.info(
        `Collection already contains ${existingCount} orders.`
      );
      return;
    }

    logger.info(`Seeding ${TOTAL_ORDERS} orders...`);

    for (
      let start = 0;
      start < TOTAL_ORDERS;
      start += BATCH_SIZE
    ) {
      const end = Math.min(
        start + BATCH_SIZE,
        TOTAL_ORDERS
      );

      const batch = Array.from(
        { length: end - start },
        (_, offset) => createOrder(start + offset, sellers)
      );

      await Order.insertMany(batch, {
        ordered: true,
      });

      logger.info(
        `Inserted ${end} / ${TOTAL_ORDERS}`
      );
    }

    logger.info('Order seeding completed successfully.');

  } catch (error) {
    logger.error(`Seeding failed: ${error}`);
    process.exitCode = 1;

  } finally {
    await pool.end();
    await mongoose.disconnect();
  }
}

await seedOrders();
