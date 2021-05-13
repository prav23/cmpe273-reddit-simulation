const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const defaultAvatars = require("../utils/defaultImages");

const Vote = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    vote: {
      type: Number,
      default: 0,
    },
  }
);

const Community = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    name: { type: String, required: true },
    numUsers: { type: Number },
    numPosts: { type: Number },
    createdBy: { type: String },
    description: { type: String },
    rules: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
    photo: {
      type: String,
      default: defaultAvatars.communityAvatar,
    },
    paginationSize: { type: Number },
    score: {
      type: Number,
      default: 0,
    },
    votes: {
      type: [Vote],
      default: [],
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

Community.index(
  {
    name: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("community", Community);
