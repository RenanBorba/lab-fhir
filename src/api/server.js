// src/api/server.js
const express = require("express");
const { connectDB, getExames } = require("../services/db");
const { sendToKafka } = require("../kafka/producer");

const app = express();
// Endereço da rota POST 
app.post("/publish", async (req, res) => {
  // Busca todos os exames no PostgreSQL
  const exames = await getExames();

  // Percorre cada exame e envia para o Kafka
  for (const exame of exames) {
    await sendToKafka("lab-results", exame);
  }

  // Retorna resposta da API
  res.send({ status: "Dados enviados para Kafka" });
});

// Inicializa API e conecta no banco
app.listen(3000, async () => {
  await connectDB();
  console.log("API rodando na porta 3000");
});