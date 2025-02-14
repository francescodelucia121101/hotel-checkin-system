import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // ✅ Controlla se siamo nel client
    if (typeof window !== "undefined") {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/bookings");
      setBookings(response.data);
    } catch (error) {
      setError("Errore nel recupero delle prenotazioni");
      console.error("Errore:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Dashboard Prenotazioni</h1>
      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id} onClick={() => router.push(`/booking/${booking.id}`)}>
            {booking.guest_name} - {booking.checkin_date} → {booking.checkout_date}
          </li>
        ))}
      </ul>
    </div>
  );
}
