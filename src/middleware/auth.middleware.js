import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { findUserByIdWithRoleRepo } from "../repositories/user.repository.js";

export const authenticate = AsyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required");
  }

  const token = header.slice("Bearer ".length).trim();

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await findUserByIdWithRoleRepo(payload.sub);

  if (!user) {
    throw new ApiError(401, "Account no longer exists");
  }

  req.user = { id: user._id.toString(), role: user.role };
  next();
});