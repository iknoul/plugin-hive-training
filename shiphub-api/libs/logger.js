import { config } from '../config.js';

export const logger = {
  debug: (message) => {
    if (config.logLevel === 'debug') {
      console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`);
    }
  },
  info: (message) => {
    if (['debug', 'info'].includes(config.logLevel)) {
      console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
    }
  },
  warn: (message) => {
    if (['debug', 'info', 'warn'].includes(config.logLevel)) {
      console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
    }
  },
  error: (message) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
  }
};
