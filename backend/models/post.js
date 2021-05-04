const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema(
  {
    communityName: {
        type: String,
        required: true,
    },
    author: {
      type: String,
      required: true,
    },
    title: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    votes: [
        {user: String, vote: Number}
    ],
    postType: {
        type: String,
        default: 'text'
        },
    url: {
        type: String,
        default: ""
    },
    text: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    score: {
        type: Number,
        default: 0,
    }
  }
);

module.exports = mongoose.model("post", Post);

