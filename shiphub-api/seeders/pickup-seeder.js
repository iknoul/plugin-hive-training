import { postgresPool as pool } from "../config/postgres.js";

const label = [
  'shop', 'warehouse', 'shop', 'warehouse',
  'warehouse', 'shop', 'shop', 'shop',
  'warehouse', 'shop', 'warehouse', 'shop',
  'shop', 'warehouse', 'warehouse', 'shop'
];

const address_city = [
  'Kochi', 'Bengaluru', 'Mumbai', 'Chennai',
  'Kochi', 'Pune', 'Hyderabad', 'Thrissur',
  'Kozhikode', 'Bengaluru', 'Mumbai', 'Delhi',
  'Thiruvananthapuram', 'Pune', 'Chennai', 'Perambra'
];

const address_pin = [
  '682001', '560001', '400001', '600001',
  '682016', '411001', '500001', '680001',
  '673001', '560034', '400053', '110001',
  '695001', '411014', '600017', '673525'
];

const address = [
  'Opp Federal Bank, Gandhi Road',
  'Plot 42, Industrial Area Phase 2, Peenya',
  'Shop 14, Linking Road, Bandra West',
  'No 88, Anna Salai, Guindy Industrial Estate',
  'Building 7, Port Trust Warehouse Zone, Willingdon Island',
  '102 FC Road, Near Deccan Gymkhana',
  '3rd Floor, Madhapur Main Road, HITEC City',
  '24 Swaraj Round North, Near Vadakkunnathan Temple',
  'Godown 5, Mavoor Road, Near KSRTC Bus Stand',
  '19 Koramangala 4th Block, 80 Feet Road',
  'Unit 11, Andheri East MIDC Central Road',
  'B-12 Connaught Place, Inner Circle',
  '45 MG Road, Near Secretariat, Statue',
  'Warehouse 9, Viman Nagar, Airport Road',
  '16 North Usman Road, T Nagar',
  'WareAwar Court road, Perambra'
];

function buildDynamicSellerArr(arr, targetSize) {
  if (targetSize <= 0 || arr.length === 0) return [];

  const [first, ...rest] = arr;
  const result = [first];

  for (let i = 1; i < targetSize; i++) {
    const randomItem = rest[Math.floor(Math.random() * rest.length)];
    result.push(randomItem);
  }

  return result;
}

async function seedPickupaddress () {

    const client = await pool.connect();

      await client.query('BEGIN');

      // first seller remain no pickup address
      const { rows } = await client.query(
        `SELECT sellers.seller_id FROM SELLERS
         OFFSET 1 
        `
      )

    // this fn build seller id arr, first id no repeat (specified seller has one pickup address only)
    const sellerIds = buildDynamicSellerArr(rows, address.length)

    const query = `
        INSERT INTO pickup_addresses (seller_id
        , label, address, city, pincode)
        SELECT * FROM UNNEST($1::integer[], $2::varchar[], 
        $3::text[], $4::varchar[], $5::varchar[])
        ON CONFLICT (seller_id, label, city) DO NOTHING
        RETURNING *
    `

    const result = await pool.query(query, [
        sellerIds,
        label, 
        address,
        address_city,
        address_pin
    ])

    console.log(result, 'Pickup address seeded')

    await pool.end()

}

await seedPickupaddress()