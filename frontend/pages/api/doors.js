import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { room_id, integration_type, api_key } = req.body;

      if (!room_id || !integration_type || !api_key) {
        return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
      }

      const client = await pool.connect();
      await client.query(
        'INSERT INTO doors (room_id, integration_type, api_key) VALUES ($1, $2, $3) ON CONFLICT (room_id) DO UPDATE SET integration_type = $2, api_key = $3',
        [room_id, integration_type, api_key]
      );
      client.release();

      return res.status(201).json({ message: 'Integrazione salvata con successo' });
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      return res.status(500).json({ error: 'Errore nel salvataggio' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
