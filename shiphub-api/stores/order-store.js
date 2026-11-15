import { buildPaginatedResponse } from '../libs/pagination.js';
import { Order } from '../models/order-model.js';
import { Counter } from '../models/counter-model.js';


async function findIdempotentOrder(idempotencyKey, orderData) {
    if (!idempotencyKey) return null;

    const existingOrder = await Order.findOne({ idempotencyKey });

    if (!existingOrder) return null;

    const isSameRequest =
        existingOrder.customer === orderData.customer.trim() &&
        existingOrder.product === orderData.product.trim() &&
        existingOrder.priority === orderData.priority;

    if (!isSameRequest) {
        throw new HttpError(422,  'Idempotency key was already used with different data');
    }

    return existingOrder;
}

export async function getAllOrders({filters = {}, page = 1, limit = 20}) {
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
		...orderData,
		...(idempotencyKey && { idempotencyKey }),
    });

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
