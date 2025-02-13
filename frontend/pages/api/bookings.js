import { Pool } from "pg";
import axios from "axios";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ✅ Funzione per recuperare prenotazioni da Wubook
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
        from: today,
        to: endDate,
        include_guests: true,
        mode: "all"
      },
      { headers: { "x-api-key": apiKey } }
    );

    console.log("📌 Risposta da Wubook:", JSON.stringify(response.data, null, 2));

    return response.data.data.reservations || [];
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
      const { structure_id, wubook_api_key } = req.body;

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
        if (booking.status === "Cancelled") continue; // Ignoriamo prenotazioni cancellate

        const guest = booking.rooms[0]?.customers[0] || {};
        const guestName = guest.name || "Ospite sconosciuto";
        const guestEmail = guest.email || "email@sconosciuta.com";
        const guestsCount = booking.rooms[0]?.occupancy?.adults || 1;
        const roomId = booking.rooms[0]?.id_zak_room;
        const checkinDate = booking.rooms[0]?.dfrom;
        const checkoutDate = booking.rooms[0]?.dto;

        await client.query(
          `INSERT INTO bookings (structure_id, guest_name, guest_email, guests_count, room_id, start_date, end_date, checked_in, door_code, tax_paid)
           VALUES ($1, $2, $3, $4, $5, $6, $7, false, null, false)
           ON CONFLICT (guest_email, start_date) DO NOTHING`,
          [
            structure_id,
            guestName,
            guestEmail,
            guestsCount,
            roomId,
            checkinDate,
            checkoutDate
          ]
        );
      }

      client.release();

      return res.status(201).json({ message: "Prenotazioni sincronizzate con successo" });
    } catch (error) {
      console.error("Errore durante la sincronizzazione delle prenotazioni:", error);
      return res.status(500).json({ error: "Errore durante la sincronizzazione delle prenotazioni" });
    }
  } 
  
  else if (req.method === "GET") {
    try {
      const { structure_id } = req.query;
      if (!structure_id) {
        return res.status(400).json({ error: "Structure ID richiesto" });
      }

      const result = await pool.query(
        "SELECT * FROM bookings WHERE structure_id = $1 ORDER BY start_date ASC",
        [structure_id]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error);
      res.status(500).json({ error: "Errore nel recupero delle prenotazioni" });
    }
  } 
  
  else {
    res.status(405).json({ error: "Metodo non consentito" });
  }
}
