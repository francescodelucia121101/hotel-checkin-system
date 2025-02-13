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
      const result = await client.query('SELECT * FROM doors');
      client.release();
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Errore nel recupero delle porte:', error);
      return res.status(500).json({ error: 'Errore nel recupero delle porte' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, room_id } = req.body;
      const client = await pool.connect();
      await client.query('INSERT INTO doors (name, room_id) VALUES ($1, $2)', [name, room_id]);
      client.release();
      return res.status(201).json({ message: 'Porta aggiunta con successo' });
    } catch (error) {
      console.error('Errore durante la creazione della porta:', error);
      return res.status(500).json({ error: 'Errore durante la creazione della porta' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
