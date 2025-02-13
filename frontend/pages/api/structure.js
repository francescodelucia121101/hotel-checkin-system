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
      const result = await client.query('SELECT * FROM structures');
      client.release();
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Errore nel recupero delle strutture:', error);
      return res.status(500).json({ error: 'Errore nel recupero delle strutture' });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, wubook_key, manager_id } = req.body;
      const client = await pool.connect();
      await client.query('INSERT INTO structures (name, wubook_key, manager_id) VALUES ($1, $2, $3)', [name, wubook_key, manager_id]);
      client.release();
      return res.status(201).json({ message: 'Struttura aggiunta con successo' });
    } catch (error) {
      console.error('Errore durante la creazione della struttura:', error);
      return res.status(500).json({ error: 'Errore durante la creazione della struttura' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
