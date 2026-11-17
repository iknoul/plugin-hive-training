import { postgresPool as pool } from "../config/postgres";

export async function getSellerWithPickupCount({pickup_address_count, allowgreater = false }) {

    const having = `HAVING COUNT(sa.address_id) ${allowgreater ? '>' : '='} ${pickup_address_count}`

    const query = `SELECT s.seller_name, COUNT(sa.address_id) as pickup_addresses
                   FROM SELLERS s LEFT JOIN PICKUP_ADDRESSES sa ON s.seller_id = sa.seller_id
                   GROUP BY s.seller_id
                   ${pickup_address_count ? having : ''};
                   `
    return await pool.query(query)
}

export async function getSellerNoPickupCount() {

    // this is better than where + IS NULL
    const query = `SELECT s.seller_name as name, s.seller_email as email
                   FROM SELLERS s
                   WHERE NOT EXIST (
                        SELECT 1
                        FROM PICKUP_ADDRESSES sa
                        WHERE sa.seller_id = s.seller_id
                    )
                   `
    return await pool.query(query)
}

