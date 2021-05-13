const express = require('express');
var kafka = require("../kafka/client");

const sendMessage = async (req, res) => {
  let msg = {};
  msg.route = "send_message";
  msg.input = req.body;
  
  kafka.make_request("message", msg, function (err, results) {
    console.log("in make request call back");
    // console.log(results);
    // console.log(err);
    if (err) {
      console.log(err);
      return res.status(err.status).send(err.data);
    }
    else {
      console.log(results);
      return res.status(results.status).send(results.data);
    }
  });
}

const getMessage = async (req, res) => {
  let msg = {};
  msg.route = "get_messagelist";
  msg.email = req.params.email;
  
  kafka.make_request("message", msg, function (err, results) {
    console.log("in make request call back");
    // console.log(results);
    // console.log(err);
    if (err) {
      console.log(err);
      return res.status(err.status).send(err.data);
    }
    else {
      console.log(results);
      return res.status(results.status).send(results.data);
    }
  });
}

module.exports = { sendMessage, getMessage };