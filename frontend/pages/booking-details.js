import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`/api/bookings/${id}`);
      setBooking(response.data);
    } catch (error) {
      setError("Errore nel recupero della prenotazione");
      console.error("Errore:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Dettagli Prenotazione</h1>
      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {booking && (
        <div>
          <p>Ospite: {booking.guest_name}</p>
          <p>Email: {booking.guest_email}</p>
          <p>Check-in: {booking.checkin_date}</p>
          <p>Check-out: {booking.checkout_date}</p>
          <p>Stato: {booking.status}</p>
          <p>Codice Porta: {booking.door_code || "Non assegnato"}</p>
        </div>
      )}
    </div>
  );
}
