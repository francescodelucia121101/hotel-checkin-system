import { parse } from 'cookie';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.authToken;

    if (!token) {
      return res.status(401).json({ error: 'Non autenticato' });
    }

    // Simulazione verifica token (in produzione, usa JWT)
    const client = await pool.connect();
    const result = await client.query('SELECT id, name, email FROM managers WHERE id = 1'); // Modifica con il tuo metodo di autenticazione
    client.release();

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Utente non trovato' });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Errore autenticazione:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}
