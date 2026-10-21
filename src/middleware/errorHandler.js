import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, _req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => ({
        path: e.path,
        message: e.message,
      }));
      error = new ApiError(422, "Validation failed", errors);
    } else if (error.name === "CastError") {
      error = new ApiError(400, `Invalid ${error.path}`);
    } else if (error.code === 11000) {
      const fields = Object.keys(error.keyPattern ?? {});
      error = new ApiError(409, `Duplicate value for: ${fields.join(", ")}`);
    } else {
      error = new ApiError(500, "Internal server error");
    }
  }

  const body = {
    success: false,
    message: error.message,
    errors: error.errors ?? [],
    ...(env.NODE_ENV === "development" && { stack: error.stack }),
  };

  res.status(error.statusCode ?? 500).json(body);
};