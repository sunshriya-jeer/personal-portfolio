/**
 * Centralized error handler middleware.
 * Formats error responses and avoids exposing sensitive internal details or secrets.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose CastError (invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format for field '${err.path || 'id'}': ${err.value}`;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const validationDetails = Object.values(err.errors).map((val) => val.message);
    message = validationDetails.join('; ');
  }

  // Handle resource not found errors
  if (statusCode === 404) {
    message = err.message || 'Requested resource was not found';
  }

  const response = {
    success: false,
    message,
    statusCode
  };

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
