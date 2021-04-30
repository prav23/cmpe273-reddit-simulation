const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Community = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
    },
    name: { type: String, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    description: { type: String },
    rules: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
    photo: { type: String },
    upVotes: {
      type: Number,
    },
    downVotes: { type: Number },
    paginationSize: { type: Number },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

Group.index(
  {
    name: 1,
  },
  { unique: true }
);

module.exports = mongoose.model("community", Community);
