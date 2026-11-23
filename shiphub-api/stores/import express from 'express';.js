import express from 'express';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildSchema } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import DataLoader from 'dataloader';
import depthLimit from 'graphql-depth-limit';
import { resolvers } from './resolvers.js';
import { getSellersByIds, getOrder } from './data.js';

const schemaPath = new URL('../schema.graphql', import.meta.url);
const schemaText = readFileSync(fileURLToPath(schemaPath), 'utf8');
const schema = buildSchema(schemaText);

for (const [typeName, fields] of Object.entries(resolvers)) {
  for (const [fieldName, resolve] of Object.entries(fields)) {
    schema.getType(typeName).getFields()[fieldName].resolve = resolve;
  }
}

const app = express();

function createContext() {
  return {
    loaders: {
      seller: new DataLoader(async (ids) => getSellersByIds(ids))
    }
  };
}

app.get('/orders/:id', (request, response) => {
  const order = getOrder(request.params.id);
  if (!order) return response.status(404).json({ message: 'Order not found' });
  response.json(order);
});

app.all('/graphql', createHandler({
  schema,
  context: createContext,
  validationRules: [depthLimit(5)]
}));