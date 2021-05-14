const express = require('express');
var kafka = require("../kafka/client");

const getProfile = async (req, res) => {
  let msg = {};
  msg.route = "get_userprofile";
  msg.user_name = req.params.user_name;
  
  kafka.make_request("userprofile", msg, function (err, results) {
    console.log("in make request call back");
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

const getCommunity = async (req, res) => {
  let msg = {};
  msg.route = "get_usercommunity";
  msg.user_name = req.params.user_name;
  
  kafka.make_request("userprofile", msg, function (err, results) {
    console.log("in make request call back");
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

module.exports = { getProfile, getCommunity };