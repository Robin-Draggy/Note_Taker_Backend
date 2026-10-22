import { User } from "../models/user.model.js";

export const findUserByIdRepo = (id) => User.findById(id);

export const findUserByIdWithRoleRepo = (id) =>
  User.findById(id).select("_id role");

export const findUserByEmailRepo = (email) =>
  User.findOne({ email: email.trim().toLowerCase() });

export const findUserByEmailWithPasswordRepo = (email) =>
  User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");

export const createUserRepo = (data) => User.create(data);

export const findAllUsersQuery = () => User.find({}).select("-passwordHash");

export const updateUserByIdRepo = (id, updateData) =>
  User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select("-passwordHash");

export const deleteUserByIdRepo = (id) =>
  User.findByIdAndDelete(id).select("-passwordHash");
