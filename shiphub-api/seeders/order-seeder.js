
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import { Order } from '../models/order-model.js';

const TOTAL_ORDERS = 50000;

const priorities = ['low', 'normal', 'high'];
const statuses = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

async function seedOrders() {
  try {
    await connectDatabase();

    const existingCount = await Order.countDocuments();

    if (existingCount > 0) {
      console.log(
        `Collection already contains ${existingCount} orders.`
      );
      return;
    }

    const batchSize = 1000;

    for (let start = 0; start < TOTAL_ORDERS; start += batchSize) {
      const batch = [];

      for (
        let i = start;
        i < Math.min(start + batchSize, TOTAL_ORDERS);
        i++
      ) {
        batch.push({
          id: `ORD-${String(i + 1).padStart(6, '0')}`,
          customer: `Customer ${i + 1}`,
          product: `Product ${i + 1}`,
          status: statuses[i % statuses.length],
          priority: priorities[i % priorities.length],
          createdAt: new Date(
            Date.now() - i * 60_000
          ),
        });
      }

      await Order.insertMany(batch, { ordered: false });

      console.log(
        `Inserted ${Math.min(start + batchSize, TOTAL_ORDERS)} / ${TOTAL_ORDERS}`
      );
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

await seedOrders();
