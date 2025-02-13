import { serialize } from 'cookie';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

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
      const { email, password } = req.body;

      const client = await pool.connect();
      const result = await client.query('SELECT id, password FROM managers WHERE email = $1', [email]);
      client.release();

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Credenziali errate' });
      }

      const manager = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, manager.password);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenziali errate' });
      }

      const token = 'fake-jwt-token'; // Generare un token JWT in produzione

      res.setHeader('Set-Cookie', serialize('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      }));

      return res.status(200).json({ message: 'Login riuscito', token });
    } catch (error) {
      console.error('Errore nel login:', error);
      return res.status(500).json({ error: 'Errore interno del server' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
