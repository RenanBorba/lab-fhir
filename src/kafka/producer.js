// src/kafka/producer.js
const kafka = require("../config/kafka");

// Cria producer Kafka
const producer = kafka.producer();

const sendToKafka = async (topic,data) => {
await producer.connect(); // conecta ao broker

// Envia mensagem para o tópico
await producer.send({
    topic,
    messages: [{ value:JSON.stringify(data) }], // serializa JSON
  });

console.log("Enviado para Kafka: ", data.exame_nome);
};

module.exports= { sendToKafka };