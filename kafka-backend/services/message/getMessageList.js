const { Message } = require("../../sqlmodels/index");
const { redisHost, redisPort } = require("../../utils/config");
var cacher = require('sequelize-redis-cache');
var redis = require('redis');
var rc = redis.createClient(redisPort, redisHost);
const sqldb = require("../../sqlmodels");
var cacheObj = cacher(sqldb.sequelize, rc).model('Message').ttl(10000);

const getMessageList = async (msg, callback) => {
  console.log("In handle request:"+ JSON.stringify(msg));
  const email = msg.email;
  let results = {};
  let err = {};
  try {
    var receivedMessages = await Message.findAll({
        where: { receivedBy: email },
    });
    var sentMessages = await Message.findAll({
        where: { sentBy: email }
    });
    receivedMessage = Array.from(receivedMessages);
    sentMessage = Array.from(sentMessages);
    const allMessages = receivedMessage.concat(sentMessage);
    //console.log(allMessages);
    if (allMessages) {
      // Uncomment this code when testing redis caching
      cacheObj.findAll({ where: {}, logging: console.log})
        .then(function(row) {
          //console.log(row); // sequelize db object
          console.log(cacheObj.cacheHit); // true or false
        });
      results.status = 200;
      results.data = allMessages;
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

exports.getMessageList = getMessageList;