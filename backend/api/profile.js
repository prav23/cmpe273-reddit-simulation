const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const User = require("../models/User");
var kafka = require("../kafka/client");

const getProfile = async (req, res) => {
  let msg = {};
  msg.route = "get_profile";
  msg.user_email = req.params.user_email;
  
  kafka.make_request("profile", msg, function (err, results) {
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

const updateProfile = async (req, res) => {
  let msg = {};
  msg.route = "update_profile";
  msg.user_email = req.params.user_email;
  
  kafka.make_request("profile", msg, function (err, results) {
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

const getImage = async (req, res) => {
  console.log("Inside user profile image name get");
  console.log("Req Body : ", req.body);
  const user_email = req.params.user_email;
  User.findOne({ email: user_email }, (error, user) => {
      if (error) {
          res.status(500).end("Error");
      }
      else {
          console.log(user.profilePicture);
          res.writeHead(200, {
              'Content-Type': 'application/json'
          });
          res.end(user.profilePicture);
      }
  });
}

const getImagePath = async (req, res) => {
  console.log("Inside user profile image get");
  console.log("Req Body : ", req.body);
  var image = path.join(__dirname, '..') + '/public/userimages/' + req.params.profilePicture;
  if (fs.existsSync(image)) {
      res.sendFile(image);
      console.log(image);
  }
  else {
      res.sendFile(path.join(__dirname, '..') + '/public/userimages/userdefaultimage.png')
  }
}
const userstorage = multer.diskStorage({
  destination: path.join(__dirname, '..') + '/public/userimages',
  filename: (req, file, cb) => {
      cb(null, req.params.user_email + "-" + Date.now() + path.extname(file.originalname));
  }
});
const useruploads = multer({
  storage: userstorage,
  limits: { fileSize: 1000000 },
}).single("image");

const uploadImage = async (req, res) => {
  console.log("Inside images post Request");
  console.log("Req Body : ", req.body);
  const user_email = req.params.user_email;
  useruploads(req, res, function (err) {
      if (!err) {
          User.updateOne({ email: user_email }, {$set: {
              "profilePicture": req.file.filename,
          }}, (error, result) => {
              if (error) {
                  res.status(500).end("Error");
              }
              else {
                  res.writeHead(200, {
                      'Content-Type': 'application/json'
                  });
                  res.end(req.file.filename);
                  console.log(req.file.filename);
                  console.log("user profile image success upload");
              }
          }); 
      }
      else {
          console.log('Error');
      }
  })
}

module.exports = { getProfile, updateProfile, getImage, getImagePath, uploadImage };