import { Pool } from "pg";
import axios from "axios";
import cron from "node-cron";

export const config = {
  api: { bodyParser: true },
};

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function fetchBookingsFromWubook(apiKey) {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 20);

    const response = await axios.post(
      "https://kapi.wubook.net/kp/reservations/fetch_reservations",
      {
        dfrom: today.toISOString().split("T")[0],
        dto: futureDate.toISOString().split("T")[0],
      },
      {
        headers: { "x-api-key": apiKey },
      }
    );

    return response.data?.data?.reservations || [];
  } catch (error) {
    console.error("Errore nel recupero delle prenotazioni da Wubook:", error.response?.data || error.message);
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { structure_id, filter } = req.query;
      if (!structure_id) return res.status(400).json({ error: "structure_id mancante" });

      const condition = filter === "passate" ? "<" : ">=";
      const result = await pool.query(
        `SELECT * FROM bookings WHERE structure_id = $1 AND checkin_date ${condition} CURRENT_DATE ORDER BY checkin_date ASC`,
        [structure_id]
      );

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error);
      return res.status(500).json({ error: "Errore nel recupero delle prenotazioni" });
    }
  }

  if (req.method === "POST") {
    try {
      const { wubook_api_key } = req.body;
      if (!wubook_api_key) return res.status(400).json({ error: "API Key mancante" });

      const bookings = await fetchBookingsFromWubook(wubook_api_key);
      if (bookings.length === 0) return res.status(404).json({ error: "Nessuna prenotazione trovata su Wubook" });

      const client = await pool.connect();
      for (const booking of bookings) {
        const checkinDate = booking.rooms[0]?.dfrom;
        const checkoutDate = booking.rooms[0]?.dto;
        const guestsCount = booking.rooms[0]?.occupancy?.adults || 0;
        const guestName = booking.id_human;
        const guestEmail = "email_sconosciuta@example.com";
        const status = booking.status;
        const roomId = booking.rooms[0]?.id_zak_room;
        const doorCode = booking.rooms[0]?.door_code || null;

        await client.query(
          `INSERT INTO bookings (wubook_reservation_id, structure_id, room_id, guest_name, guest_email, guests_count, checkin_date, checkout_date, status, door_code)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (wubook_reservation_id) DO NOTHING`,
          [booking.id, 1, roomId, guestName, guestEmail, guestsCount, checkinDate, checkoutDate, status, doorCode]
        );
      }
      client.release();

      return res.status(201).json({ message: "Prenotazioni sincronizzate con successo" });
    } catch (error) {
      console.error("Errore durante la sincronizzazione delle prenotazioni:", error);
      return res.status(500).json({ error: "Errore durante la sincronizzazione" });
    }
  }
}
