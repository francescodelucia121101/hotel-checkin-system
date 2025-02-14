import { Pool } from "pg";
import axios from "axios";
import cron from "node-cron";

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
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

async function fetchBookingsFromWubook(apiKey) {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 20);

    const response = await axios.post(
      "https://kapi.wubook.net/kp/reservations/fetch_reservations",
      {
        from_date: today.toISOString().split("T")[0], // Data odierna
        to_date: futureDate.toISOString().split("T")[0], // Tra 20 giorni
      },
      { headers: { "x-api-key": apiKey } }
    );

    return response.data.data.reservations || [];
  } catch (error) {
    console.error("❌ Errore nel recupero delle prenotazioni da Wubook:", error.response?.data || error.message);
    return [];
  }
}

async function syncBookings() {
  console.log("🔄 Sincronizzazione automatica delle prenotazioni...");
  const client = await pool.connect();

  try {
    const structures = await client.query("SELECT id, wubook_key FROM structures WHERE wubook_key IS NOT NULL");
    for (const structure of structures.rows) {
      const bookings = await fetchBookingsFromWubook(structure.wubook_key);

      for (const booking of bookings) {
        const roomId = booking.rooms[0]?.id_zak_room || null;
        const checkinDate = convertDate(booking.rooms[0]?.dfrom);
        const checkoutDate = convertDate(booking.rooms[0]?.dto);
        const status = booking.status || "Confirmed";
        const guestsCount = booking.rooms[0]?.occupancy?.adults || 1;
        const doorCode = booking.rooms[0]?.door_code || null;

        const guest = booking.rooms[0]?.customers[0];
        const guestName = guest?.name || "Ospite Sconosciuto";
        const guestEmail = guest?.email && guest.email.includes("@") ? guest.email : "email_sconosciuta@example.com";

        if (!checkinDate || !checkoutDate) {
          console.error("❌ Data non valida per la prenotazione:", booking);
          continue;
        }

        await client.query(
          `INSERT INTO bookings 
            (wubook_reservation_id, structure_id, room_id, guest_name, guest_email, guests_count, start_date, end_date, checkin_date, checkout_date, status, door_code) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
          ON CONFLICT (wubook_reservation_id) DO NOTHING`,
          [booking.id, structure.id, roomId, guestName, guestEmail, guestsCount, checkinDate, checkoutDate, checkinDate, checkoutDate, status, doorCode]
        );
      }
    }
  } catch (error) {
    console.error("❌ Errore durante la sincronizzazione automatica:", error);
  } finally {
    client.release();
  }
}

// **Avvia il cron job per la sincronizzazione ogni 5 minuti**
cron.schedule("*/5 * * * *", syncBookings);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { structure_id, filter } = req.query;

      if (!structure_id) {
        return res.status(400).json({ error: "Structure ID mancante" });
      }

      let query = "SELECT * FROM bookings WHERE structure_id = $1";
      let params = [structure_id];

      if (filter === "prossime") {
        query += " AND start_date >= CURRENT_DATE";
      } else if (filter === "passate") {
        query += " AND end_date < CURRENT_DATE";
      }

      query += " ORDER BY start_date ASC";

      const client = await pool.connect();
      const result = await client.query(query, params);
      client.release();

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("❌ Errore nel recupero delle prenotazioni:", error);
      return res.status(500).json({ error: "Errore nel recupero delle prenotazioni" });
    }
  } else {
    return res.status(405).json({ message: "Metodo non consentito" });
  }
}
