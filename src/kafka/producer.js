// src/kafka/producer.js
const kafka = require("../config/kafka");

const producer = kafka.producer();

const sendToKafka = async (topic,data) => {
await producer.connect();

await producer.send({
    topic,
    messages: [{ value:JSON.stringify(data) }],
  });

console.log("Enviado para Kafka: ", data.exame_nome);
};

module.exports= { sendToKafka };