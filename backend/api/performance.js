const { successResponse, errorResponse } = require("./helper");
const User = require("../models/User");
const { Message } = require("../sqlmodels");
const bcrypt = require("bcryptjs");
const faker = require('faker');
const kafka = require("../kafka/client");

// Enable this config if you want to test getAllMessages with Redis caching
const { redisHost, redisPort } = require("../utils/config");
var cacher = require('sequelize-redis-cache');
var redis = require('redis');
var rc = redis.createClient(redisPort, redisHost);
const sqldb = require("../sqlmodels");
var cacheObj = cacher(sqldb.sequelize, rc).model('Message').ttl(10000);

const createFakeUsers = async (req, res) => {
  try{
    const userCount = Number(req.params.userCount);
    for (i = 0; i < userCount; i++) {
      const name = faker.name.findName(); 
      const email = faker.internet.email();
      const password = faker.random.word();
      const profilePicture = faker.internet.avatar();
      const gender = faker.name.gender();
      const location = faker.address.city();
      const description = faker.random.word();
      User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          errors.email = "Email already exists";
          return res.status(400).json(errors);
        } else {
          const newUser = new User({
            name,
            email,
            profilePicture,
            gender,
            location,
            description
          });
          
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save();
            });
          });
        }
      });
    }
    return res.status(200).json("Created Fake Users");
  }
  catch(error){
    return res.status(400).json(error.message);
  }
};

const createFakeUsersKafka = async (req, res) => {
  let msg = {};
  msg.route = "create_users";
  msg.input = req.params.userCount;
  
  kafka.make_request("performance", msg, function (err, results) {
    console.log("in make request call back");
    console.log(results);
    console.log(err);
    if (err) {
      console.log(err);
      return res.status(err.status).send(err.data);
    }
    else {
      console.log(results);
      return res.status(results.status).send(results.data);
    }
  });
};

const createFakeMessages = async (req, res) => {
    try{
      const messageCount = Number(req.params.messageCount);
      for (i = 0; i < messageCount; i++) {
        const sentBy = faker.internet.email(); 
        const receivedBy = faker.internet.email();
        const message = faker.random.word();
        const payload = {
            receivedBy,
            sentBy,
            message
        };
        const newMessage = await Message.create(payload);
      }
      return res.status(200).json("Created Fake Messages");
    }
    catch(error){
      return res.status(400).json(error.message);
    }
  };

const createFakeMessagesKafka = async (req, res) => {
  let msg = {};
  msg.route = "create_messages";
  msg.input = req.params.messageCount;
  
  kafka.make_request("performance", msg, function (err, results) {
    console.log("in make request call back");
    console.log(results);
    console.log(err);
    if (err) {
      console.log(err);
      return res.status(err.status).send(err.data);
    }
    else {
      console.log(results);
      return res.status(results.status).send(results.data);
    }
  });
};

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        if (allUsers) {
          return successResponse(req, res, { allUsers });
        } else {
          return errorResponse(
            req,
            res,
            "Unable to find an users",
            401
          );
        }
      } catch (error) {
        return errorResponse(req, res, error.message);
      }
};

const getAllMessages = async (req, res) => {
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
    console.log(error);
    return errorResponse(req, res, error.message);
    }
}

const getAllMessagesRedis = async (req, res) => {
    try {
        const allMessages = await Message.findAll({
          where: {},
        });
        if (allMessages) {
          // Uncomment this code when testing redis caching
          cacheObj.findAll({ where: {}, logging: console.log})
            .then(function(row) {
              //console.log(row); // sequelize db object
              console.log(cacheObj.cacheHit); // true or false
            });
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
        console.log(error);
        return errorResponse(req, res, error.message);
      }
}

const getAllMessagesRedisKafka = async (req, res) => {
  let msg = {};
  msg.route = "get_messages";
  
  kafka.make_request("performance", msg, function (err, results) {
    console.log("in make request call back");
    console.log(results);
    console.log(err);
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

module.exports = {createFakeUsers, createFakeMessages, createFakeUsersKafka, createFakeMessagesKafka, getAllUsers, getAllMessages, getAllMessagesRedis, getAllMessagesRedisKafka};
