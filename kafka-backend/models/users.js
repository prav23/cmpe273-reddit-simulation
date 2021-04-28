"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const userSchema = new schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: true
    },
    last_name: {
      type: String,
      trim: true,
      required: true
    },
    user_name: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    email_id: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;