import { buildPaginatedResponse } from '../libs/pagination.js';
import { Order } from '../models/mongoose-models/order-model.js';
import { Counter } from '../models/mongoose-models/counter-model.js';
import { createHash } from 'node:crypto';
import { IdempotencyRecord } from '../models/mongoose-models/idempotency-model.js';

function generateRequestHash(orderData) {
    const normalizedData = {
        customer: orderData.customer.trim(),
        product: orderData.product.trim(),
        priority: orderData.priority ?? 'normal',
    };

    return createHash('sha256')
        .update(JSON.stringify(normalizedData))
        .digest('hex');
}

async function findIdempotentOrder(idempotencyKey, orderData) {
    if (!idempotencyKey) return null;

    const existingRecord = await IdempotencyRecord.findOne({
        key: idempotencyKey
    });  

    if (!existingRecord) return null;

    const requestHash = generateRequestHash(orderData);

    if (existingRecord.requestHash !== requestHash) {
        throw new HttpError(
            422,
            'Idempotency key was already used with different data'
        );
    }

    return Order.findOne({ id: existingRecord.resourceId });
}

export async function getAllOrders({
	filters = {}, 
	page = 1, 
	limit = 20
}) {
	const query = {};

	if (filters.searchQuery?.trim()) {
		const search = filters.searchQuery.trim();

		query.$or = [
		{ customer: { $regex: search, $options: 'i' } },
		{ product: { $regex: search, $options: 'i' } },
		];
	}

	if (filters.status) {
		query.status = filters.status;
	}

	if (filters.priority) {
		query.priority = filters.priority;
	}

	const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
	const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
	const skip = (safePage - 1) * safeLimit;

	const [orders, total] = await Promise.all([
		Order.find(query)
		.select('-_id')
		.sort({ priority: 1, createdAt: -1, id: 1 })
		.skip(skip)
		.limit(safeLimit)
		.lean(),
		Order.countDocuments(query),
	]);

	return buildPaginatedResponse({
		data:orders, 
		total, page:safePage, 
		limit:safeLimit
	})
}

export async function getOrderById(id) {
  	return Order.findOne({ id });
}

export async function createOrder(orderData, idempotencyKey) {

	const existingOrder = await findIdempotentOrder(
        idempotencyKey,
        orderData
    );

    if (existingOrder) {
        return {
            order: existingOrder,
            isReplay: true,
        };
    }

    const counter = await Counter.findOneAndUpdate(
        { _id: 'orderId' },
        { $inc: { sequence: 1 } },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        }
    );

    const order = await Order.create({
        id: `ORD-${String(counter.sequence).padStart(3, '0')}`,
        status: 'Pending',
		items: orderData.items ?? [],
		...orderData
    });

	if (idempotencyKey) {
		await IdempotencyRecord.create({
			key: idempotencyKey,
			requestHash: generateRequestHash(orderData),
			resourceId: order.id,
		});
	}

	return {
        order,
        isReplay: false,
    };
}

export async function updateOrder(id, updates) {
	return Order.findOneAndUpdate(
		{ id },
		{ $set: updates },
		{ new: true, runValidators: true }
	);
}
