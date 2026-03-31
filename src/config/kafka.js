// src/config/kafka.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "lab-app",
  brokers: ["kafka:9092"], // Docker
});

module.exports = kafka;