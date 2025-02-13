import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM rooms');
      client.release();

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Errore nel recupero delle camere:', error);
      return res.status(500).json({ error: 'Errore durante il recupero delle camere' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
