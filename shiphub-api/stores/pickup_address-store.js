import { postgresPool as pool } from "../config/postgres";

export async function getPickupAddressesCount({pickup_address_count, allowgreater = false }) {

    const having = `HAVING COUNT(sa.address_id) ${allowgreater ? '>' : '='} ${pickup_address_count}`

    const query = `SELECT s.seller_name, COUNT(sa.address_id) as pickup_addresses
                   FROM SELLERS s LEFT JOIN PICKUP_ADDRESSES sa ON s.seller_id = sa.seller_id
                   GROUP BY s.seller_id
                   ${pickup_address_count ? having : ''};
                   `
    return await pool.query(query)
}