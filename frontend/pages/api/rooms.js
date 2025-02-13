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
      return res.status(500).json({ error: 'Errore nel recupero delle camere' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, structure_id } = req.body;
      const client = await pool.connect();
      await client.query('INSERT INTO rooms (name, structure_id) VALUES ($1, $2)', [name, structure_id]);
      client.release();
      return res.status(201).json({ message: 'Camera aggiunta con successo' });
    } catch (error) {
      console.error('Errore durante la creazione della camera:', error);
      return res.status(500).json({ error: 'Errore durante la creazione della camera' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
