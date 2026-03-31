// src/kafka/consumer.js
const kafka = require("../config/kafka");
const axios = require("axios");
const { toFHIRBundle } = require("../utils/mapper");

const consumer = kafka.consumer({ groupId: "lab-group" });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "lab-results", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        const bundle = toFHIRBundle(data);

        const response = await axios.post(
          "http://hapi-fhir:8080/fhir",
          bundle
        );

        console.log("Bundle enviado com sucesso");
        console.log("Response:", response.data.type);

      } catch (err) {
        console.error(
          "Erro ao enviar Bundle:",
          err.response?.data || err.message
        );
      }
    }
  });
};

runConsumer();