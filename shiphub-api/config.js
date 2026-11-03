import dotenv from 'dotenv';
dotenv.config();

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

export const config = {
  port: validatePort(process.env.PORT || '3000'),
  logLevel: validateLogLevel(process.env.LOG_LEVEL || 'info'),
  apiUrl: process.env.API_URL || 'http://localhost:3000'
};