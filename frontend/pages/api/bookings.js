import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { structure_id } = req.query;

    if (!structure_id) {
      return res.status(400).json({ error: "Parametri mancanti" });
    }

    try {
      const result = await pool.query(
        "SELECT * FROM bookings WHERE structure_id = $1 ORDER BY start_date ASC",
        [structure_id]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error);
      res.status(500).json({ error: "Errore nel recupero delle prenotazioni" });
    }
  }
}
