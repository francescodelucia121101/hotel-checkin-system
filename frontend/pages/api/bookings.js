import { Pool } from "pg";
import axios from "axios";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function fetchBookingsFromWubook(apiKey) {
  try {
    const response = await axios.post(
      "https://kapi.wubook.net/kp/reservations/fetch_bookings",
      {},
      { headers: { "x-api-key": apiKey } }
    );

    console.log("Risposta da Wubook:", response.data); // LOG

    return response.data.reservations || [];
  } catch (error) {
    console.error("Errore nel recupero delle prenotazioni da Wubook:", error.response?.data || error.message);
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("Body ricevuto:", req.body);
      const { wubook_api_key } = req.body;

      if (!wubook_api_key) {
        return res.status(400).json({ error: "API Key obbligatoria" });
      }

      const bookings = await fetchBookingsFromWubook(wubook_api_key);

      if (bookings.length === 0) {
        return res.status(404).json({ error: "Nessuna prenotazione trovata su Wubook" });
      }

      const client = await pool.connect();
      for (const booking of bookings) {
        await client.query(
          `INSERT INTO bookings (guest_name, guest_email, guests_count, start_date, end_date, checked_in, door_code, tax_paid)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (guest_email, start_date) DO NOTHING`,
          [
            booking.guest_name || "Ospite sconosciuto",
            booking.guest_email || "email@sconosciuta.com",
            booking.guests_count || 1,
            booking.start_date,
            booking.end_date,
            false,
            null,
            false,
          ]
        );
      }
      client.release();

      return res.status(201).json({ message: "Prenotazioni sincronizzate con successo" });
    } catch (error) {
      console.error("Errore durante la sincronizzazione delle prenotazioni:", error);
      return res.status(500).json({ error: "Errore durante la sincronizzazione delle prenotazioni" });
    }
  } else if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT * FROM bookings ORDER BY start_date ASC");
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error);
      res.status(500).json({ error: "Errore nel recupero delle prenotazioni" });
    }
  } else {
    res.status(405).json({ error: "Metodo non consentito" });
  }
}
