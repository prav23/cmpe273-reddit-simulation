const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
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
  
}

const getImagePath = async (req, res) => {
  console.log("Inside user profile image get");
  console.log("Req Body : ", req.body);
  var image = path.join(__dirname, '..') + '/public/userimages/' + req.params.user_image;
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
      cb(null, req.params.email + "-" + Date.now() + path.extname(file.originalname));
  }
});
const useruploads = multer({
  storage: userstorage,
  limits: { fileSize: 1000000 },
}).single("image");

const uploadImage = async (req, res) => {
  
}

module.exports = { getProfile, updateProfile, getImage, getImagePath, uploadImage };