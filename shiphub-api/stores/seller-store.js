import { postgresPool as pool } from "../config/postgres.js";
import { buildPaginatedResponse } from "../libs/pagination.js";
import { Order } from "../models/mongoose-models/order-model.js";

export async function getSellerWithPickupCount({pickup_address_count, allowgreater = false }) {

    const having = `HAVING COUNT(sa.address_id) ${allowgreater ? '>' : '='} ${pickup_address_count}`

    const query = `SELECT s.name, COUNT(sa.address_id) as pickup_addresses
                   FROM SELLERS s LEFT JOIN PICKUP_ADDRESSES sa ON s.seller_id = sa.seller_id
                   GROUP BY s.seller_id
                   ${pickup_address_count ? having : ''};
                   `
    return await pool.query(query)
}

export async function getSellerNoPickupCount() {

    // this is better than where + IS NULL
    const query = `SELECT s.name, s.email
                   FROM SELLERS s
                   WHERE NOT EXIST (
                        SELECT 1
                        FROM PICKUP_ADDRESSES sa
                        WHERE sa.seller_id = s.seller_id
                    )
                   `
    return await pool.query(query)
}

export async function getSellerById(id) {
    const query = `
        SELECT 
            s.seller_id AS id, 
            s.name, 
            s.email
        FROM SELLERS s 
        WHERE s.seller_id = $1
    `;
    
    return await pool.query(query, [id]);
}

// items are currenlty embedded in order collection, need aggregate
// to match the sellerid of the item
export async function getSellerItems({
	sellerId,
	filters = {},
	page = 1,
	limit = 20
}) {
	const safeSellerId = Number(sellerId);

	const safePage = Math.max(1, Number.parseInt(page, 10) || 1);
	const safeLimit = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
	const skip = (safePage - 1) * safeLimit;

	const matchItems = {
		'items.sellerId': String(safeSellerId)
	};

	if (filters.status) {
		matchItems['items.status'] = filters.status;
	}

	const search = filters.searchQuery?.trim();

	const pipeline = [
		{ $unwind: '$items' },

		{ $match: matchItems },

		...(search
			? [{
				$match: {
					$or: [
						{ 'items.name': { $regex: search, $options: 'i' } },
						{ 'items.type': { $regex: search, $options: 'i' } }
					]
				}
			}]
			: []),

		{
			$project: {
				_id: 0,
				orderId: '$id',
				customer: 1,
				orderStatus: '$status',
				createdAt: 1,
				name: '$items.name',
				id: '$items.item_id',
				type: '$items.type',
				status: '$items.status'
			}
		},

		{ $sort: { 'item.priority': 1, createdAt: -1, orderId: 1 } }
	];

	const [result] = await Order.aggregate([
		...pipeline,
		{
			$facet: {
				data: [
					{ $skip: skip },
					{ $limit: safeLimit }
				],
				total: [
					{ $count: 'count' }
				]
			}
		}
	]);

	return buildPaginatedResponse({
		data: result.data,
		total: result.total[0]?.count || 0,
		page: safePage,
		limit: safeLimit
	});
}

