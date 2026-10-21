import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return next(new ApiError(422, "Validation failed", errors));
  }

  // Stash parsed/coerced values — Express 5–safe (no reassignment of req.query)
  req.validated = result.data;
  next();
};