import { config } from "../config/config.js";
import { logger } from "../libs/logger.js";

const GRAPHQL_URL = config.graphqlUrl

const query = `
	query {
		sellerOne: seller(id: 1) {
			...SellerDetails
		}

		sellerTwo: seller(id: 2) {
			...SellerDetails
		}
	}

	fragment SellerDetails on Seller {
		name
		email
		shippedItems(limit: 5) {
			data {
				id
				name
			}
		}
	}
`;

const variableQuery = `
	query GetTwoSellers($limit: Int!) {
		sellerOne: seller(id: 1) {
			...SellerDetails
		}

		sellerTwo: seller(id: 2) {
			...SellerDetails
		}
	}

	fragment SellerDetails on Seller {
		name
		email
		shippedItems(limit: $limit) {
			data {
				id
				name
			}
			
		}
	}
`;

const queryWithNonExistField = `
	query GetTwoSellers($limit: Int!) {
		sellerOne: seller(id: 1) {
			...SellerDetails
		}

		sellerTwo: seller(id: 2) {
			...SellerDetails
		}
	}

	fragment SellerDetails on Seller {
		name
		email
		bloodGroup
		shippedItems(limit: $limit) {
			data {
				id
				name
			}
			
		}
	}
`;

const updateOrderStatusMutation = `
    mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
        updateOrderStatus(id: $id, status: $status) {
            id
            customer
            status
        }
    }
`;

async function executeGraphQL(query, variables = {}, method = 'POST') {
	const options = {
		method,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	};

	let url = GRAPHQL_URL;

	if (method === 'GET') {
		const params = new URLSearchParams({
			query,
			variables: JSON.stringify(variables)
		});

		url = `${GRAPHQL_URL}?${params}`;
	} else {
		options.body = JSON.stringify({
			query,
			variables
		});
	}

	const response = await fetch(url, options);
	const result = await response.json();

	if (!response.ok || result.errors) {
		logger.error('GraphQL request failed:');
		logger.error(JSON.stringify(result, null, 2));
		process.exitCode = 1;
		return;
	}

	logger.debug(JSON.stringify(result, null, 2));

	return result;
}



async function main() {
	logger.info('\n--- TEST 1: Aliases and Fragments ---\n');

	await executeGraphQL(query);

	logger.info('\n--- TEST 2: Variables ---\n');

	await executeGraphQL(variableQuery, {
		limit: 3
	});

	logger.info('\n--- TEST 3: Non-Existing field ---\n');

	try {
		await executeGraphQL(queryWithNonExistField, {
			limit: 3
		});
	} catch (error) {
		logger.error(`TEST 3 Request failed:, ${error}`);
	}

	logger.info('\n--- TEST 4: Query with limit 500 ---\n');

	try {
		await executeGraphQL(variableQuery, {
			limit: 500
		});
	} catch (error) {
		logger.error(`TEST 4 Request failed:, ${error}`);
	}

	

	logger.info('\n--- TEST 5: Mutation with GET ---\n');

	try {
		await executeGraphQL(updateOrderStatusMutation, {
			id: 'ORD-001',
			status: 'Shipped'
		}, 'GET');
	} catch (error) {
		logger.error(`TEST 5 Request failed:, ${error}`);
	}
	

}

main().catch((error) => {
	logger.error(`Request failed:, ${error}`);
	process.exitCode = 1;
});
