import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/request-logging.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import routes from './routes/index.js';
import { createHandler } from 'graphql-http/lib/use/express';
import depthLimit from 'graphql-depth-limit';
import { createContext } from './graphql/context.js';
import { buildedSchema } from './graphql/index.js';

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ success: true, message: 'ShipHub API is Healthy' });
});

app.get('/', (req, res) => {
    res.json({ success: true, message: 'ShipHub API is running' });
});

app.use((req, res, next)=> {
  next();
})

app.all('/graphql', createHandler({
  schema: buildedSchema,
  context: createContext,
  validationRules: [depthLimit(5)]
}));

// API routes
app.use('/', routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
