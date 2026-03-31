// src/services/db.js
const { Client } = require("pg");

const client = new Client({
  host: "db", // Docker
  user: "labuser",
  password: "labpass",
  database: "lab",
});

const connectDB = async () => {
await client.connect();
console.log("Conectado ao PostgreSQL");
};

const getExames = async () => {
const res = await client.query("SELECT * FROM exames");
return res.rows;
};

module.exports = { connectDB, getExames };