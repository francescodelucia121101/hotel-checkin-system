import { Pool } from 'pg';
import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Estende dayjs per supportare il parsing di formati personalizzati
dayjs.extend(customParseFormat);

export const config = {
  api: {
    bodyParser: true,
  },
};

// Connessione al database PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Funzione per recuperare le prenotazioni da Wubook
async function fetchBookingsFromWubook(apiKey) {
  try {
    const response = await axios.post(
      'https://kapi.wubook.net/kp/reservations/fetch_reservations',
      { from: dayjs().format("YYYY-MM-DD"), to: dayjs().add(30, 'day').format("YYYY-MM-DD") },
      { headers: { 'x-api-key': apiKey } }
    );

    return response.data.data.reservations || [];
  } catch (error) {
    console.error('❌ Errore nel recupero delle prenotazioni da Wubook:', error.response?.data || error.message);
    return [];
  }
}

// Funzione per convertire le date al formato PostgreSQL (YYYY-MM-DD)
function parseDate(dateString) {
  if (!dateString) return null;
  const parsedDate = dayjs(dateString, "DD/MM/YYYY").format("YYYY-MM-DD");
  return parsedDate === "Invalid Date" ? null : parsedDate;
}

// API handler per sincronizzare le prenotazioni con il database
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log("📌 Body ricevuto:", req.body);
      const { structure_id, wubook_api_key } = req.body;

      if (!wubook_api_key || !structure_id) {
        return res.status(400).json({ error: 'API Key di Wubook o structure_id mancante' });
      }

      const bookings = await fetchBookingsFromWubook(wubook_api_key);

      if (bookings.length === 0) {
        return res.status(404).json({ error: 'Nessuna prenotazione trovata su Wubook' });
      }

      const client = await pool.connect();
      for (const booking of bookings) {
        const guestName = booking.id_human || "Ospite Sconosciuto";
        const guestEmail = booking.booker_email || "email_sconosciuta@example.com";
        const roomId = booking.rooms[0]?.id_zak_room || null;
        const guestsCount = booking.rooms[0]?.occupancy.adults || 1;
        const checkinDate = parseDate(booking.rooms[0]?.dfrom);
        const checkoutDate = parseDate(booking.rooms[0]?.dto);
        const status = booking.status;
        const doorCode = booking.rooms[0]?.door_code || null;

        // Imposta start_date ed end_date uguali a checkin_date e checkout_date
        const startDate = checkinDate || dayjs().format("YYYY-MM-DD");
        const endDate = checkoutDate || dayjs().add(1, 'day').format("YYYY-MM-DD");

        if (!startDate || !endDate) {
          console.warn(`⚠️ Data non valida per la prenotazione ID ${booking.id}`);
          continue;
        }

        await client.query(
          `INSERT INTO bookings 
            (wubook_reservation_id, structure_id, room_id, guest_name, guest_email, guests_count, checkin_date, checkout_date, start_date, end_date, status, door_code) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (wubook_reservation_id) 
          DO UPDATE SET status = EXCLUDED.status, door_code = EXCLUDED.door_code`,
          [booking.id, structure_id, roomId, guestName, guestEmail, guestsCount, checkinDate, checkoutDate, startDate, endDate, status, doorCode]
        );
      }
      client.release();

      return res.status(201).json({ message: 'Prenotazioni sincronizzate con successo' });
    } catch (error) {
      console.error('❌ Errore durante la sincronizzazione delle prenotazioni:', error);
      return res.status(500).json({ error: 'Errore durante la sincronizzazione delle prenotazioni' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
