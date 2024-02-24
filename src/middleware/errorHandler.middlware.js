const errorHandlerMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error!";

  return res.status(statusCode).json({
    message: message,
    success: error.success,
    errors: error.errors ? error.errors : undefined,
  });
};

export default errorHandlerMiddleware;
