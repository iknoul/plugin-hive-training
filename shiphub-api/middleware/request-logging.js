import {logger } from '../libs/logger.js';

export const requestLogger = (req, res, next) => {  
  res.on('finish', () => {
    const logData = `${req.method} ${req.originalUrl} ${res.statusCode}`;

    if (res.statusCode >= 500) {
      logger.error(`[ERROR] ${logData}`);
    } else if (res.statusCode >= 400) {
      logger.warn(`[WARN] ${logData}`);
    } else {
      logger.info(`[INFO] ${logData}`);
    }
  });

  next();
};