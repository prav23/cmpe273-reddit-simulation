"use strict";
const mongoose = require("mongoose");
const schema = mongoose.Schema;
//Schema
const Message = new schema({
  receivedBy: {type: String, required: true},
  sentBy: {type: String, required: true},
  message: {type: String, required: true},
  createAt: {type: String, required: true}
},
{
  versionKey: false
});

module.exports = mongoose.model("message", Message);