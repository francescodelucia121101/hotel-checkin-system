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
      const result = await client.query('SELECT * FROM integrations');
      client.release();
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Errore nel recupero delle integrazioni:', error);
      return res.status(500).json({ error: 'Errore nel recupero delle integrazioni' });
    }
  } else if (req.method === 'POST') {
    try {
      const { structure_id, nuki_key, hikvision_key } = req.body;
      const client = await pool.connect();
      await client.query('INSERT INTO integrations (structure_id, nuki_key, hikvision_key) VALUES ($1, $2, $3)', [structure_id, nuki_key, hikvision_key]);
      client.release();
      return res.status(201).json({ message: 'Integrazione aggiunta con successo' });
    } catch (error) {
      console.error('Errore durante la configurazione delle integrazioni:', error);
      return res.status(500).json({ error: 'Errore durante la configurazione delle integrazioni' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
