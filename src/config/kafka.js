// src/config/kafka.js
const { Kafka } = require("kafkajs");

// Cria cliente Kafka com ID da aplicação
const kafka = new Kafka({
  clientId: "lab-app",
  brokers: ["kafka:9092"], // Docker (broker)
});

module.exports = kafka;