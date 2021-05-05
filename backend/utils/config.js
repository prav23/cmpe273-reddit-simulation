"use strict";
const config = {
   mlab_db: "mongodb+srv://cmpe273:group4@cluster0.9znxf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
   secret: "cmpe273_kafka_passport_mongo",
   frontendURI: "http://localhost:3000",
   kafkaURI: "localhost:2181",
   mysqlUser: "root",
   mysqlPassword: "",
   mysqlHost: "",
   mysqlDatabase: "",
   awsBucket: "",
   // Keys can't be added here because AWS categorizes this as vulnerability.
   awsAccessKey: "",
   awsSecretAccessKey: "",
   awsPermission: "public-read",
   redisHost: "localhost",
   redisPort: 6379  
};

module.exports = config;
