const errorHandlerMiddleware = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error!";

  return res.status(statusCode).json({
    error: message,
    success: error.success,
  });
};

export default errorHandlerMiddleware;
