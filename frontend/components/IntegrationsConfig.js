import { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import axios from "axios";

export default function IntegrationsConfig() {
  const [wubookKey, setWubookKey] = useState("");
  const [nukiKey, setNukiKey] = useState("");
  const [hikvisionKey, setHikvisionKey] = useState("");

  const handleSave = async () => {
    try {
      await axios.post("/api/integrations", { wubookKey, nukiKey, hikvisionKey });
      alert("Configurazioni salvate con successo!");
    } catch (error) {
      alert("Errore nel salvataggio delle integrazioni");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Configurazione Integrazioni</Typography>
      <Box sx={{ mt: 2 }}>
        <TextField fullWidth label="Wubook API Key" value={wubookKey} onChange={(e) => setWubookKey(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Nuki API Key" value={nukiKey} onChange={(e) => setNukiKey(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Hikvision API Key" value={hikvisionKey} onChange={(e) => setHikvisionKey(e.target.value)} sx={{ mb: 2 }} />
        <Button variant="contained" color="primary" onClick={handleSave}>Salva Configurazioni</Button>
      </Box>
    </Container>
  );
}
