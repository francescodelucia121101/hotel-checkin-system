import { Pool } from "pg";
import axios from "axios";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ✅ Funzione per recuperare le prenotazioni da Wubook
async function fetchBookingsFromWubook(apiKey) {
  try {
    const today = new Date().toISOString().split("T")[0]; // Data di oggi
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const endDate = nextMonth.toISOString().split("T")[0]; // Data tra 1 mese

    console.log(`📅 Recupero prenotazioni dal ${today} al ${endDate}`);

    const response = await axios.post(
      "https://kapi.wubook.net/kp/reservations/fetch_reservations",
      {
        from: today, // Data di inizio
        to: endDate, // Data di fine
        include_guests: true, // Includi informazioni sugli ospiti
        mode: "all" // Recupera tutte le prenotazioni
      },
      { headers: { "x-api-key": apiKey } }
    );

    console.log("📌 Risposta da Wubook:", JSON.stringify(response.data, null, 2));

    return response.data.reservations || [];
  } catch (error) {
    console.error("❌ Errore nel recupero delle prenotazioni da Wubook:", error.response?.data || error.message);
    return [];
  }
}

// ✅ API Handler
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("Body ricevuto:", req.body);
      const { wubook_api_key } = req.body;

      if (!wubook_api_key) {
        return res.status(400).json({ error: "API Key obbligatoria" });
      }

      // ✅ Recupero prenotazioni da Wubook
      const bookings = await fetchBookingsFromWubook(wubook_api_key);

      if (bookings.length === 0) {
        return res.status(404).json({ error: "Nessuna prenotazione trovata su Wubook" });
      }

      // ✅ Salva nel database
      const client = await pool.connect();
      for (const booking of bookings) {
        await client.query(
          `INSERT INTO bookings (guest_name, guest_email, guests_count, start_date, end_date, checked_in, door_code, tax_paid)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (guest_email, start_date) DO NOTHING`,
          [
            booking.guest.name || "Ospite sconosciuto",
            booking.guest.email || "email@sconosciuta.com",
            booking.guests || 1,
            booking.date_arrival,
            booking.date_departure,
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
