// src/kafka/consumer.js
const kafka = require("../config/kafka");
const axios = require("axios");
const { toFHIR } = require("../utils/mapper");

const consumer = kafka.consumer({ groupId: "lab-group" });

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "lab-results", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        // Ler mensagem
        const data = JSON.parse(message.value.toString());

        // Mapear para FHIR
        const { patient, observation } = toFHIR(data);

        // Buscar paciente por CPF
        const search = await axios.get(
          //`http://hapi-fhir:8080/fhir/Patient?identifier=http://www.saude.gov.br/fhir/r4/NamingSystem/cpf|${data.paciente_cpf}`
          `http://hapi-fhir:8080/fhir/Patient?identifier=${data.paciente_cpf}`
        );

        let patientId;

        if (search.data.total > 0) {
          // Já existe
          patientId = search.data.entry[0].resource.id;
          console.log("Paciente já existe:", patientId);
        } else {
          // Criar novo
          const patientRes = await axios.post(
            "http://hapi-fhir:8080/fhir/Patient",
            patient
          );

          patientId = patientRes.data.id;
          console.log("Paciente criado:", patientId);
        }

        // Linkar no exame
        observation.subject.reference = `Patient/${patientId}`;

        // Enviar Observation
        await axios.post(
          "http://hapi-fhir:8080/fhir/Observation",
          observation
        );

        console.log("Enviado para FHIR:", data.exame_nome);

      } catch (err) {
        console.error("Erro ao processar mensagem:", err.message);
      }
    }
  });
};

runConsumer();