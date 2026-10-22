import mongoose from "mongoose";
import { Post } from "../models/post.model.js";

export const createPostRepo = (data) => Post.create(data);

export const getPostsByUserQuery = ({ userId, page, limit, sort }) => {
  const sortField = sort.startsWith("-") ? sort.slice(1) : sort;
  const sortDir = sort.startsWith("-") ? -1 : 1;
  const skip = (page - 1) * limit;

  return Post.aggregate([
    { $match: { author: new mongoose.Types.ObjectId(userId) } },
    { $sort: { [sortField]: sortDir } },

    {
      $facet: {
        results: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "author",
              pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
            },
          },
          { $unwind: "$author" },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);
};
