import bcrypt from 'bcryptjs';
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
      const { name, email, password } = req.body;

      console.log("Dati ricevuti:", { name, email, password });

      // Hash della password prima di salvarla nel database
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Password hashata:", hashedPassword);

      const client = await pool.connect();
      const result = await client.query(
        'INSERT INTO managers (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, hashedPassword]
      );
      client.release();

      console.log("Utente registrato con successo:", result.rows[0]);

      return res.status(201).json({ message: 'Registrazione completata' });
    } catch (error) {
      console.error('Errore nella registrazione:', error);
      return res.status(500).json({ error: 'Errore interno del server' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
