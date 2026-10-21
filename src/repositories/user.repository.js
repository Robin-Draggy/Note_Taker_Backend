import { User } from "../models/user.model.js";

export const findUserByIdRepo = (id) =>
  User.findById(id);

export const findUserByIdWithRoleRepo = (id) =>
  User.findById(id).select("_id role");

export const findUserByEmailRepo = (email) =>
  User.findOne({ email: email.trim().toLowerCase() });

export const findUserByEmailWithPasswordRepo = (email) =>
  User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");

export const createUserRepo = (data) => User.create(data);