"use strict";
const config = {
   mlab_db: "mongodb+srv://cmpe273:group4@cluster0.9znxf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
   secret: "cmpe273_kafka_passport_mongo",
   frontendURI: "http://localhost:3002/",
   kafkaURI: "localhost:2181",
   mysqlUser: "admin",
   mysqlPassword: "adminpwd",
   mysqlHost: "reddit.cx5zkraouu5g.us-east-1.rds.amazonaws.com",
   mysqlDatabase: "reddit",
   awsBucket: "",
   // Keys can't be added here because AWS categorizes this as vulnerability.
   awsAccessKey: "",
   awsSecretAccessKey: "",
   awsPermission: "public-read",
   redisHost: "localhost",
   redisPort: 6379  
};

module.exports = config;
