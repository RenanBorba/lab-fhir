// src/kafka/consumer.js
const kafka = require("../config/kafka");
const axios = require("axios");
const { toFHIRBundle } = require("../utils/mapper");

// Cria consumer com grupo
const consumer = kafka.consumer({ groupId: "lab-group" });

const runConsumer = async () => {
  await consumer.connect(); // conecta ao Kafka

  // O tópico define o assunto específico que você quer 
  //  monitorar (neste caso, o tópico chamado lab-results)
  // Se for a primeira vez que esse groupId se conecta, 
  //  ele vai ler todas as mensagens desde o início
  await consumer.subscribe({ topic: "lab-results", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        // Converte mensagem Kafka (JSON)
        const data = JSON.parse(message.value.toString());

        // Mapeia dados para Bundle FHIR
        const bundle = toFHIRBundle(data);

        // Envia Bundle para servidor FHIR
        const response = await axios.post(
          "http://hapi-fhir:8080/fhir",
          bundle
        );

        // Log de sucesso
        console.log("Bundle enviado com sucesso");
        console.log("Response: ", response.data.type);

      } catch (err) {
        // Tratamento de erro (FHIR ou rede)
        console.error(
          "Erro ao enviar Bundle: ",
          err.response?.data || err.message
        );
      }
    }
  });
};

runConsumer();