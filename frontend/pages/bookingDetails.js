import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Typography, Box } from "@mui/material";
import axios from "axios";

export default function BookingDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBookingDetails(id);
    }
  }, [id]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await axios.get(`/api/bookings/${bookingId}`);
      setBooking(response.data);
    } catch (error) {
      console.error("Errore nel recupero dei dettagli della prenotazione:", error);
    }
  };

  if (!booking) return <Typography>Caricamento...</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4">Dettagli Prenotazione</Typography>
      <Box sx={{ mt: 3 }}>
        <Typography><b>Numero Ospiti:</b> {booking.guests_count}</Typography>
        <Typography><b>Data Inizio:</b> {booking.start_date}</Typography>
        <Typography><b>Data Fine:</b> {booking.end_date}</Typography>
        <Typography><b>Check-in effettuato:</b> {booking.checked_in ? "Sì" : "No"}</Typography>
        <Typography><b>Codice porta assegnato:</b> {booking.door_code || "Non assegnato"}</Typography>
        <Typography><b>Tassa di soggiorno pagata:</b> {booking.tax_paid ? "Sì" : "No"}</Typography>
        <Typography><b>Nome Ospite:</b> {booking.guest_name}</Typography>
        <Typography><b>Email Ospite:</b> {booking.guest_email}</Typography>
      </Box>
    </Container>
  );
}
