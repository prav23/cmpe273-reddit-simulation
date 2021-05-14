"use strict";
var connection = new require("./kafka/connection");
var connectMongoDB = require("./utils/dbConnection");

//import topics files
const accountService = require("./services/account");
const performanceService = require("./services/performance");
const messageService = require("./services/message");
const userprofileService = require("./services/userprofile");
const communitiesService = require("./services/communities");
const postsService = require("./services/posts");
const commentsService = require("./services/comments");
const inviteService = require("./services/member");
const analyticService = require("./services/analytics");
const profileService = require("./services/profile");

//MongoDB connection
connectMongoDB();

//Handle topic request
const handleTopicRequest = (topic_name, fname) => {
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("Kafka Server is running ");
  consumer.on("message", function (message) {
    console.log("Message received for " + topic_name);
    var data = JSON.parse(message.value);
    fname.handle_request(data.data, (err, res) => {
      response(data, res, err, producer);
      return;
    });
  });
};

const response = (data, res, err, producer) => {
  var payloads = [
    {
      topic: data.replyTo,
      messages: JSON.stringify({
        correlationId: data.correlationId,
        data: res,
        err: err,
      }),
      partition: 0,
    },
  ];
  producer.send(payloads, function (err, data) {
    if (err) {
      console.log("Error when producer sending data", err);
    } else {
      console.log(data);
    }
  });
  return;
};

// Topics
handleTopicRequest("account", accountService);
handleTopicRequest("performance", performanceService);
handleTopicRequest("message", messageService);
handleTopicRequest("userprofile", userprofileService);
handleTopicRequest("communities", communitiesService);
handleTopicRequest("createCommunity", communitiesService);
handleTopicRequest("posts", postsService);
handleTopicRequest("comments", commentsService);
handleTopicRequest("invite", inviteService);
handleTopicRequest("analytic", analyticService);
handleTopicRequest("profile", profileService);
