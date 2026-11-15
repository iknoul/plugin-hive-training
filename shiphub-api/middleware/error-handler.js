import {HttpError} from '../libs/http-error.js';
import {logger} from '../libs/logger.js';


export const notFound = (req, res, next) => {
  next(new HttpError(404, `Route not found: ${req.originalUrl}`));
};



  const databaseUnavailableErrors = new Set([
    'MongoServerSelectionError',
    'MongooseServerSelectionError',
    'MongoNetworkError',
    'MongoNotConnectedError',
  ]);

  const isDatabaseUnavailable = (err)=>{
   return  databaseUnavailableErrors.has(err.name) ||
    err.message?.includes('buffering timed out');
  }

// Single centralized error handler
export const errorHandler = (err, req, res, next) => {

  // Handle malformed JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {  
      err.message = 'Malformed JSON in request body'
  }

   if (isDatabaseUnavailable(err)) {
      err.error = 'Database service unavailable',
      err.message = 'Please try again later.',
      err.status = 503
  }

  const statusCode = err.status || 500;
  
  if (statusCode === 500) {
    logger.error(err);
  } 

  res.status(statusCode).json({
        error: err.message || 'Internal Server Error',
        details: err.details || null,
        fields: err.fields || null
    });
};