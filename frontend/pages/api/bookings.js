import { Pool } from 'pg';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: true,
  },
};

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const convertDate = (dateString) => {
  if (!dateString) return null;
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

async function fetchBookingsFromWubook(apiKey) {
  try {
    const response = await axios.post(
      'https://kapi.wubook.net/kp/reservations/fetch_reservations',
      {},
      { headers: { 'x-api-key': apiKey } }
    );

    return response.data.data.reservations || [];
  } catch (error) {
    console.error('❌ Errore nel recupero delle prenotazioni da Wubook:', error.response?.data || error.message);
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log("📌 Body ricevuto:", req.body);
      const { wubook_api_key } = req.body;

      if (!wubook_api_key) {
        return res.status(400).json({ error: 'API Key mancante' });
      }

      const bookings = await fetchBookingsFromWubook(wubook_api_key);

      if (bookings.length === 0) {
        return res.status(404).json({ error: 'Nessuna prenotazione trovata su Wubook' });
      }

      const client = await pool.connect();
      for (const booking of bookings) {
        const roomId = booking.rooms[0]?.id_zak_room || null;
        const checkinDate = convertDate(booking.rooms[0]?.dfrom);
        const checkoutDate = convertDate(booking.rooms[0]?.dto);
        const status = booking.status || "Confirmed";
        const guestsCount = booking.rooms[0]?.occupancy?.adults || 1;
        const doorCode = booking.rooms[0]?.door_code || null;

        // Verifica che i dati dell'ospite siano validi
        const guest = booking.rooms[0]?.customers[0];
        const guestName = guest?.name || "Ospite Sconosciuto";
        const guestEmail = guest?.email && guest.email.includes('@') ? guest.email : "email_sconosciuta@example.com";

        if (!checkinDate || !checkoutDate) {
          console.error("❌ Data non valida per la prenotazione:", booking);
          continue;
        }

        await client.query(
          `INSERT INTO bookings 
            (wubook_reservation_id, structure_id, room_id, guest_name, guest_email, guests_count, start_date, end_date, checkin_date, checkout_date, status, door_code) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
          ON CONFLICT (wubook_reservation_id) DO NOTHING`,
          [booking.id, 1, roomId, guestName, guestEmail, guestsCount, checkinDate, checkoutDate, checkinDate, checkoutDate, status, doorCode]
        );
      }
      client.release();

      return res.status(201).json({ message: "Prenotazioni sincronizzate con successo" });
    } catch (error) {
      console.error("❌ Errore durante la sincronizzazione delle prenotazioni:", error);
      return res.status(500).json({ error: "Errore durante la sincronizzazione delle prenotazioni" });
    }
  } 
  else if (req.method === 'GET') {
    try {
      const { structure_id } = req.query;

      if (!structure_id) {
        return res.status(400).json({ error: "Structure ID mancante" });
      }

      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM bookings WHERE structure_id = $1 ORDER BY start_date ASC",
        [structure_id]
      );
      client.release();

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("❌ Errore nel recupero delle prenotazioni:", error);
      return res.status(500).json({ error: "Errore nel recupero delle prenotazioni" });
    }
  } 
  else {
    return res.status(405).json({ message: "Metodo non consentito" });
  }
}
