import { Pool } from 'pg';
import axios from 'axios';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function fetchRoomsFromWubook(apiKey) {
  try {
    const response = await axios.post(
      'https://wubook.net/api/get_rooms', 
      { api_key: apiKey }, 
      { maxRedirects: 5 } // Segue automaticamente i redirect (301)
    );

    return response.data.rooms || [];
  } catch (error) {
    console.error('Errore nel recupero delle camere da Wubook:', error);
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { structure_id, wubook_api_key } = req.body;

      // Recupero camere da Wubook
      const rooms = await fetchRoomsFromWubook(wubook_api_key);

      if (rooms.length === 0) {
        return res.status(404).json({ error: 'Nessuna camera trovata su Wubook' });
      }

      const client = await pool.connect();
      for (const room of rooms) {
        await client.query(
          'INSERT INTO rooms (name, structure_id) VALUES ($1, $2) ON CONFLICT (name, structure_id) DO NOTHING',
          [room.name, structure_id]
        );
      }
      client.release();

      return res.status(201).json({ message: 'Camere sincronizzate con successo' });
    } catch (error) {
      console.error('Errore durante la sincronizzazione delle camere:', error);
      return res.status(500).json({ error: 'Errore durante la sincronizzazione delle camere' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
