import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ROLES } from "../config/constants.js";
import { ApiError } from "../utils/ApiError.js";
import {
  hashPassword,
  comparePassword,
} from "../utils/password.js";
import {
  createUserRepo,
  findUserByEmailWithPasswordRepo,
} from "../repositories/user.repository.js";

const createToken = (userId) => {
  return jwt.sign(
    { sub: userId.toString() },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

const formatUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerUser = async ({ name, email, password }) => {
  const passwordHash = await hashPassword(password);

  let user;

  try {
    user = await createUserRepo({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: ROLES.USER,
    });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    throw error;
  }

  const token = createToken(user._id);

  return {
    user: formatUser(user),
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmailWithPasswordRepo(email);

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await comparePassword(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = createToken(user._id);

  return {
    user: formatUser(user),
    token,
  };
};