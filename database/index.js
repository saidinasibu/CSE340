const { Pool } = require("pg");
require("dotenv").config();

// Toujours privilégier DATABASE_URL si dispo
let pool;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // obligatoire pour Render / connexions distantes
    },
  });
} else {
  // fallback local (utile seulement si tu veux tester avec un Postgres installé en local)
  pool = new Pool({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || "cse340_assignment2",
    ssl: false,
  });
}

// Fonction utilitaire pour exécuter les requêtes
async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error("Database query error:", { text, params, error });
    throw error;
  }
}

module.exports = {
  query,
  pool,
};
