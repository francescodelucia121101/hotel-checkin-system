import { Pool } from "pg";
import axios from "axios";
import cron from "node-cron";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Funzione per ottenere le prenotazioni da Wubook
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
      { headers: { "x-api-key": apiKey } }
    );

    return response.data.data.reservations || [];
  } catch (error) {
    console.error("Errore nel recupero delle prenotazioni da Wubook:", error.response?.data || error.message);
    return [];
  }
}

// Funzione per salvare le prenotazioni nel database
async function saveBookingsToDatabase(bookings, structureId) {
  const client = await pool.connect();
  try {
    for (const booking of bookings) {
      const guestName = booking.id_human || "Ospite sconosciuto";
      const guestEmail = "email_sconosciuta@example.com";
      const guestsCount = booking.rooms[0]?.occupancy?.adults || 1;
      const roomId = booking.rooms[0]?.id_zak_room;
      const checkinDate = booking.rooms[0]?.dfrom;
      const checkoutDate = booking.rooms[0]?.dto;
      const status = booking.status;
      const doorCode = booking.rooms[0]?.door_code || null;

      await client.query(
        `INSERT INTO bookings
          (wubook_reservation_id, structure_id, room_id, guest_name, guest_email, guests_count, checkin_date, checkout_date, status, door_code)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (wubook_reservation_id) DO NOTHING`,
        [booking.id, structureId, roomId, guestName, guestEmail, guestsCount, checkinDate, checkoutDate, status, doorCode]
      );
    }
  } catch (error) {
    console.error("Errore durante il salvataggio delle prenotazioni:", error);
  } finally {
    client.release();
  }
}

// API handler
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("📌 Body ricevuto:", req.body);
      const { structure_id, wubook_api_key } = req.body;

      if (!wubook_api_key) {
        return res.status(400).json({ error: "API Key mancante" });
      }

      const bookings = await fetchBookingsFromWubook(wubook_api_key);

      if (bookings.length === 0) {
        return res.status(404).json({ error: "Nessuna prenotazione trovata su Wubook" });
      }

      await saveBookingsToDatabase(bookings, structure_id);

      return res.status(201).json({ message: "Prenotazioni sincronizzate con successo" });
    } catch (error) {
      console.error("❌ Errore durante la sincronizzazione delle prenotazioni:", error);
      return res.status(500).json({ error: "Errore durante la sincronizzazione delle prenotazioni" });
    }
  } else if (req.method === "GET") {
    try {
      const { structure_id, filter } = req.query;

      if (!structure_id) {
        return res.status(400).json({ error: "structure_id mancante" });
      }

      let query = "SELECT * FROM bookings WHERE structure_id = $1";
      const values = [structure_id];

      if (filter === "prossime") {
        query += " AND checkin_date >= NOW() ORDER BY checkin_date ASC";
      } else if (filter === "passate") {
        query += " AND checkin_date < NOW() ORDER BY checkin_date DESC";
      }

      const client = await pool.connect();
      const result = await client.query(query, values);
      client.release();

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error);
      return res.status(500).json({ error: "Errore nel recupero delle prenotazioni" });
    }
  } else {
    return res.status(405).json({ error: "Metodo non consentito" });
  }
}

// Avvia il cron job per il controllo automatico delle prenotazioni ogni 5 minuti
cron.schedule("*/5 * * * *", async () => {
  console.log("🔄 Controllo automatico delle prenotazioni in corso...");
  const client = await pool.connect();
  const result = await client.query("SELECT id, wubook_key FROM structures");

  for (const structure of result.rows) {
    const bookings = await fetchBookingsFromWubook(structure.wubook_key);
    await saveBookingsToDatabase(bookings, structure.id);
  }

  client.release();
});
