import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildSchema } from 'graphql';
import { orderResolvers } from './resolvers/order-resolver.js';

const schemaPath = new URL('./schema/schema.graphql', import.meta.url);
const schemaText = readFileSync(fileURLToPath(schemaPath), 'utf8');
const schema = buildSchema(schemaText);

for (const [typeName, fields] of Object.entries(orderResolvers)) {
    const graphqlType = schema.getType(typeName);

    if (!graphqlType) {
        throw new Error(`GraphQL type not found: ${typeName}`);
    }

    for (const [fieldName, resolve] of Object.entries(fields)) {
        const field = graphqlType.getFields()[fieldName];

        if (!field) {
            throw new Error(`GraphQL field not found: ${typeName}.${fieldName}`);
        }

        field.resolve = resolve;
    }
}

export { schema as buildedSchema };