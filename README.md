# cmpe273-group_project_reddit Steps to Run
CMPE 273 Project Group 4 


##	Kafka Installation:
*	Download the kafka latest release and un-zip it.
*	Go to kafka directory: cd kafka_2.11-1.1.0
*	Start Zookeeper: bin/zookeeper-server-start.sh config/ zookeeper.properties
*	Start Kafka :  bin/kafka-server-start.sh config/server.properties
*	Create Topics in : /kafka_topics

## React-Client
*	Go to frontend folder
*	npm install
*	npm start

## Node Backend
*	Go to backend folder
*	npm install
*	node app.js

## Kafka Backend
*	Go to kafka-backend folder
*	npm install
*	node server.js
