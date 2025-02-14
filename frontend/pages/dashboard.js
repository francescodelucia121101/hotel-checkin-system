import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
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
          <li key={booking.id} onClick={() => navigate(`/booking/${booking.id}`)}>
            {booking.guest_name} - {booking.start_date} → {booking.end_date}
          </li>
        ))}
      </ul>
    </div>
  );
}
