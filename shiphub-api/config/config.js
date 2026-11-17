import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve project root 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

const validatePort = (value) => {
  const port = Number.parseInt(value, 10);
  if (Number.isNaN(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid PORT configuration: "${value}". Must be a valid integer between 1 and 65535.`);
  }
  return port;
};

const validateLogLevel = (value) => {
    const validLogLevels = ['debug', 'info', 'warn', 'error'];
    if (!validLogLevels.includes(value)) {
        throw new Error(`Invalid LOG_LEVEL configuration: "${value}". Must be one of ${validLogLevels.join(', ')}.`);
    }
    return value;
}

const validateMongoDBUri = (value) => {

     if (typeof value !== 'string' || !value.trim()) {

      	throw new Error('Invalid MongoDB URI: URI must be a non-empty string');
    }

     try {
    const parsed = new URL(value.trim());
    const validProtocols = ['mongodb:', 'mongodb+srv:'];

    if (!validProtocols.includes(parsed.protocol) || !parsed.hostname) {
      throw new Error(`Invalid MongoDB URI: ${value}`);
    }

    return value.trim();
  } catch {
    throw new Error(`Invalid MongoDB URI: ${value}`);
  }
};

export const config = {
  port: validatePort(process.env.PORT || '3000'),
  logLevel: validateLogLevel(process.env.LOG_LEVEL || 'info'),
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  mongodbUri: validateMongoDBUri(process.env.MONGODB_URI)
};