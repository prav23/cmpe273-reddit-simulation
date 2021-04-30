var kafka = require("kafka-node");
var { kafkaURI } = require("../utils/config.js");

function ConnectionProvider() {
  this.getConsumer = function (topic_name) {
    this.client = new kafka.KafkaClient(kafka_url);
    this.kafkaConsumerConnection = new kafka.Consumer(this.client, [
      { topic: topic_name, partition: 0 },
    ]);
    this.client.on("ready", function () {
      console.log("client ready!");
    });

    return this.kafkaConsumerConnection;
  };

  //Code will be executed when we start Producer
  this.getProducer = function () {
    if (!this.kafkaProducerConnection) {
      this.client = new kafka.KafkaClient(kafka_url);
      var HighLevelProducer = kafka.HighLevelProducer;
      this.kafkaProducerConnection = new HighLevelProducer(this.client);
      console.log("producer ready");
    }
    return this.kafkaProducerConnection;
  };
}
exports = module.exports = new ConnectionProvider();
