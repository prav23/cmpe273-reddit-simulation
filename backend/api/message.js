const express = require('express');
const User = require('../models/User');
const Message = require("../models/message");
var kafka = require("../kafka/client");

const sendMessage = async (req, res) => {
    const receivedBy = req.body.receivedBy;
    const sentBy = req.body.sentBy;
    const message = req.body.message;
    const date = Date.now();
    var d = Date(); 
    const createAt = d.toString();
    var newmessage = new Message({
        receivedBy: receivedBy,
        sentBy: sentBy,
        message: message,
        createAt: createAt
    });
    newmessage.save((error, response) => {
        if (error) {
            console.log(error);
            res.status(500).end("Error");
        }
        if (response){
            res.status(200).end("Success_Send_Message");
        }
    });
}

const getMessage = async (req, res) => {
    const email = req.params.email;
    const receivedBy = req.params.receivedBy;
    Message.find({ sentBy: email, receivedBy: receivedBy }, (error, message) => {
        if (error) {
            console.log(error);
            res.status(500).end("Error");
        }
        if (message) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log(message);
            res.end(JSON.stringify(message));
        }
    });

}

const getUsers = async (req, res) => {
    User.find({ }, (error, user) => {
        if (error) {
            console.log(error);
            res.status(500).end("Error");
        }
        if (user) {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            console.log(user);
            res.end(JSON.stringify(user));
        }
    });
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
}

module.exports = { sendMessage, getMessage, getUsers };