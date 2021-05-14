const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    postTitle: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    parentCommentId: {
        type: String,
        default: "",
    },
    score: {
      type: Number,
      default: 0,
    },
    votes: [
        {user: String, vote: Number}
    ],
  }
);

module.exports = mongoose.model("comment", Comment);
