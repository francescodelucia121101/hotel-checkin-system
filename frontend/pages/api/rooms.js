import { Pool } from 'pg';
import axios from 'axios';

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
      const { structure_id, wubook_user, wubook_password } = req.body;

      if (!structure_id || !wubook_user || !wubook_password) {
        return res.status(400).json({ error: "Parametri mancanti" });
      }

      const token = await axios.post('https://kapi.wubook.net/acquire_token', {
        user: wubook_user,
        password: wubook_password
      });

      if (!token.data.token) {
        return res.status(403).json({ error: "Autenticazione Wubook fallita" });
      }

      const roomsResponse = await axios.post(
        'https://kapi.wubook.net/fetch_rooms',
        {},
        { headers: { Authorization: `Bearer ${token.data.token}` } }
      );

      const rooms = roomsResponse.data.rooms || [];

      if (rooms.length === 0) {
        return res.status(404).json({ error: "Nessuna camera trovata su Wubook" });
      }

      const client = await pool.connect();
      for (const room of rooms) {
        await client.query(
          'INSERT INTO rooms (name, structure_id) VALUES ($1, $2) ON CONFLICT (name, structure_id) DO NOTHING',
          [room.name, structure_id]
        );
      }
      client.release();

      return res.status(201).json({ message: "Camere sincronizzate con successo" });

    } catch (error) {
      console.error("Errore API rooms:", error);
      return res.status(500).json({ error: "Errore durante la sincronizzazione delle camere" });
    }
  } else {
    return res.status(405).json({ message: "Metodo non consentito" });
  }
}
