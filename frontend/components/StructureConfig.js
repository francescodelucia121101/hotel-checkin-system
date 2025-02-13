import { useState, useEffect } from "react";
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Alert, Snackbar, Box } from "@mui/material";
import axios from "axios";

export default function StructureConfig({ onStructureSelect }) {
  const [structures, setStructures] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [name, setName] = useState("");
  const [wubookKey, setWubookKey] = useState("");
  const [message, setMessage] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    try {
      const response = await axios.get("/api/structures");
      setStructures(response.data);

      if (!selectedStructure && response.data.length > 0) {
        setSelectedStructure(response.data[0]); // Evita loop infinito
        onStructureSelect(response.data[0]); // Passa la struttura selezionata al genitore
      }
    } catch (error) {
      console.error("Errore nel recupero delle strutture:", error);
    }
  };

  const handleSave = async () => {
    if (!name || !wubookKey) {
      setMessage({ type: "error", text: "Tutti i campi sono obbligatori" });
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.post("/api/structures", { name, wubook_key: wubookKey });
      setMessage({ type: "success", text: "Struttura salvata con successo" });
      setOpenSnackbar(true);
      setName("");
      setWubookKey("");
      fetchStructures(); // Ricarica la lista delle strutture
    } catch (error) {
      setMessage({ type: "error", text: "Errore nel salvataggio" });
      setOpenSnackbar(true);
      console.error("Errore:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", textAlign: "center" }}>
      <h2>Gestione Struttura</h2>

      {/* Notifiche */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        {message && <Alert severity={message.type}>{message.text}</Alert>}
      </Snackbar>

      {/* Form di creazione struttura */}
      <TextField fullWidth label="Nome Struttura" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Wubook API Key" value={wubookKey} onChange={(e) => setWubookKey(e.target.value)} sx={{ mb: 2 }} />
      <Button variant="contained" color="primary" onClick={handleSave} sx={{ mb: 3 }}>
        Salva Struttura
      </Button>

      {/* Selettore Struttura */}
      <h3>Strutture Esistenti</h3>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Seleziona Struttura</InputLabel>
        <Select
          value={selectedStructure?.id || ""}
          onChange={(e) => {
            const selected = structures.find(s => s.id === Number(e.target.value));
            if (selected) {
              setSelectedStructure(selected);
              onStructureSelect(selected);
            }
          }}
        >
          {structures.map((structure) => (
            <MenuItem key={structure.id} value={structure.id}>{structure.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
