import { ApiError } from "../utils/ApiError.js";
import {
  createPostRepo,
  getPostsByUserQuery,
} from "../repositories/post.repository.js";

export const createPost = async ({ userId, title, content }) => {
  return createPostRepo({
    author: userId,
    title,
    content,
  });
};

export const getPostsByUser = async ({ userId, page, limit, sort }) => {
  return getPostsByUserQuery({ userId, page, limit, sort });
};
