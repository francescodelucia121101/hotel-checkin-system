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
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM checkins');
      client.release();
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Errore nel recupero dei check-in:', error);
      return res.status(500).json({ error: 'Errore nel recupero dei check-in' });
    }
  } else if (req.method === 'POST') {
    try {
      const { booking_id, signed_document } = req.body;
      const client = await pool.connect();
      await client.query(
        'INSERT INTO checkins (booking_id, signed_document, checkin_time) VALUES ($1, $2, NOW())',
        [booking_id, signed_document]
      );
      client.release();
      return res.status(201).json({ message: 'Check-in registrato con successo' });
    } catch (error) {
      console.error('Errore durante il check-in:', error);
      return res.status(500).json({ error: 'Errore durante il check-in' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { room_id, doors } = req.body;
      const client = await pool.connect();
      
      await client.query('DELETE FROM room_doors WHERE room_id = $1', [room_id]);
      
      for (const door_id of doors) {
        await client.query('INSERT INTO room_doors (room_id, door_id) VALUES ($1, $2)', [room_id, door_id]);
      }
      
      client.release();
      return res.status(200).json({ message: 'Associazione camera-porta aggiornata' });
    } catch (error) {
      console.error('Errore durante l'associazione delle porte alla camera:', error);
      return res.status(500).json({ error: 'Errore durante l'associazione delle porte alla camera' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
