import { postgresPool as pool} from "../config/postgres.js";
import { logger } from "../libs/logger.js";

const sellers = [
    {name: 'Aron Jleventus', email: 'aronle@email.com'},
    {name: 'Nooh Mespotamian', email: 'noohmesa@email.com'},
    {name: 'Idris Habibi', email: 'habibi@email.com'},
    {name: 'Karthik Amaal', email: 'kamaal@email.com'},
    {name: 'Ishaak Ibra', email: 'ibnibra@email.com'},

]
async function sellersSeeder() {

    const query = `INSERT INTO sellers (name, email)
    SELECT * FROM UNNEST($1::text[], $2::text[])
    ON CONFLICT (email) DO NOTHING
    RETURNING *`

    await pool.query(query, [sellers.map((s)=> s.name), sellers.map((s)=>s.email)])
    
    logger.info('Sellers seeded');

    await pool.end()
} 

await sellersSeeder();