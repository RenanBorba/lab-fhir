// src/api/server.js
const express = require("express");
const { connectDB, getExames } = require("../services/db");
const { sendToKafka } = require("../kafka/producer");

const app = express();

app.post("/publish", async (req, res) => {
  const exames = await getExames();

  for (const exame of exames) {
    await sendToKafka("lab-results", exame);
  }

  res.send({ status: "Dados enviados para Kafka" });
});

app.listen(3000, async () => {
  await connectDB();
  console.log("API rodando na porta 3000");
});