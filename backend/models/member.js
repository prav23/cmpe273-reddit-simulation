const mongoose = require("mongoose");
const defaultAvatars = require('../utils/defaultImages');

const Schema = mongoose.Schema;

const Member = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "community",
      required: true,
    },
    communityName: {
      type: String,
    },
    status: {
      type: String,
      default: "invited",
    },
    photo: {
      type: String,
      default: defaultAvatars.userAvatar,
    },
    userName: {
      type: String,
      required: true,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

Member.index(
  {
    userId: 1,
    communityId: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("member", Member);
