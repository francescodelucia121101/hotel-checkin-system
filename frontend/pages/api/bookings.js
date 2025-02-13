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
      const result = await client.query('SELECT * FROM bookings');
      client.release();
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('Errore nel recupero delle prenotazioni:', error);
      return res.status(500).json({ error: 'Errore nel recupero delle prenotazioni' });
    }
  } else if (req.method === 'POST') {
    try {
      const { wubook_reservation_id, structure_id, room_id, guest_name, checkin_date, checkout_date, status } = req.body;
      const client = await pool.connect();
      await client.query(
        'INSERT INTO bookings (wubook_reservation_id, structure_id, room_id, guest_name, checkin_date, checkout_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [wubook_reservation_id, structure_id, room_id, guest_name, checkin_date, checkout_date, status]
      );
      client.release();
      return res.status(201).json({ message: 'Prenotazione aggiunta con successo' });
    } catch (error) {
      console.error('Errore durante la creazione della prenotazione:', error);
      return res.status(500).json({ error: 'Errore durante la creazione della prenotazione' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
