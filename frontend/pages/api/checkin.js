import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, document } = req.body;
    try {
      await pool.query("INSERT INTO guests (name, email, document) VALUES ($1, $2, $3)", [name, email, document]);
      res.status(201).json({ message: "Check-in completato con successo" });
    } catch (error) {
      res.status(500).json({ error: "Errore nel check-in" });
    }
  } else {
    res.status(405).json({ message: "Metodo non consentito" });
  }
}
