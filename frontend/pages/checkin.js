import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";

export default function Checkin() {
  const [guest, setGuest] = useState({ name: "", email: "", document: "" });

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/checkin", guest);
      alert("Check-in completato con successo!");
    } catch (error) {
      alert("Errore durante il check-in");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Check-in Online</Typography>
      <TextField fullWidth label="Nome" onChange={(e) => setGuest({ ...guest, name: e.target.value })} />
      <TextField fullWidth label="Email" onChange={(e) => setGuest({ ...guest, email: e.target.value })} />
      <TextField fullWidth label="Documento" onChange={(e) => setGuest({ ...guest, document: e.target.value })} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Completa Check-in</Button>
    </Container>
  );
}
