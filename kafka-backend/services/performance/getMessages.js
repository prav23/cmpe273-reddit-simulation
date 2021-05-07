const { Message } = require("../../sqlmodels/index");
const { redisHost, redisPort } = require("../../utils/config");
var cacher = require('sequelize-redis-cache');
var redis = require('redis');
var rc = redis.createClient(redisPort, redisHost);
const sqldb = require("../../sqlmodels");
var cacheObj = cacher(sqldb.sequelize, rc).model('Message').ttl(10000);

const getMessages = async (msg, callback) => {
  console.log("In handle request:" + JSON.stringify(msg));
  let results = {};
  let err = {};
  try {
    const allMessages = await Message.findOne({  where:{}
      //where: {message_id: {lte: 135}},
    });
    if (allMessages) {
      // Uncomment this code when testing redis caching
      cacheObj.findAll({ where: {}, logging: console.log})
        .then(function(row) {
          //console.log(row); // sequelize db object
          console.log(cacheObj.cacheHit); // true or false
        });
      results.status = 200;
      //results.data = allMessages;
      results.data = "success get messages with caching and kafka"
      return callback(null, results);
    } else {
      err.status = 400;
      err.data = "Unable to find messages";
      //console.log(error);
      return callback(err, null);
    }
  } catch (error) {
    err.status = 400;
    err.data = "Unable to find messages";
    console.log(error);
    return callback(err, null);
  }
};

exports.getMessages = getMessages;