const express = require('express');
const { successResponse, errorResponse } = require("./helper");
//const Message = require("../models/message");
const { Message } = require("../sqlmodels");
var kafka = require("../kafka/client");

const sendMessage = async (req, res) => {
    try{
        const { receivedBy, sentBy, message } = req.body;
        var payload = {
            receivedBy: receivedBy,
            sentBy: sentBy,
            message: message
        };
        const newMessage = await Message.create(payload);
        return successResponse(req, res, { newMessage }, 201);
    }catch(error){
        return errorResponse(req, res, error.message);
    }
}

const getMessage = async (req, res) => {
    try {
        const allMessages = await Message.findAll({
          where: {},
        });
        if (allMessages) {
          return successResponse(req, res, { allMessages });
        } else {
          return errorResponse(
            req,
            res,
            "Unable to find messages",
            401
          );
        }
      } catch (error) {
        return errorResponse(req, res, error.message);
      }
}

    // let msg = {
    //     route: "get_users",
    //     body: req.body,
    // };
    // kafka.make_request("message", msg, function (err, results) {
    //     console.log("in make request call back");
    //     console.log(results);
    //     console.log(err);
    //     if (err) {
    //         console.log("Inside err");
    //         console.log(err);
    //         return res.status(err.status).end(err.data);
    //     } else {
    //         console.log("Inside else");
    //         console.log(results);
    //         return res.status(results.status).end(results.data);
    //     }
    // });

module.exports = { sendMessage, getMessage };