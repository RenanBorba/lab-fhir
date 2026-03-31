// src/services/db.js

// Configuração de conexão com PostgreSQL
const { Client } = require("pg");

const client = new Client({
  host: "db", // nome do container Docker
  user: "labuser",
  password: "labpass",
  database: "lab",
});

// Abre conexão com banco
const connectDB = async () => {
  await client.connect();
  console.log("Conectado ao PostgreSQL");
};

// Consulta todos os exames
const getExames = async () => {
  const res = await client.query("SELECT * FROM exames");
  return res.rows;
};

module.exports = { connectDB, getExames };