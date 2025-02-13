import { useState, useEffect } from "react";
import { Button, TextField, Select, MenuItem, Box } from "@mui/material";
import axios from "axios";

export default function StructureConfig({ onStructureSelect }) {
  const [structures, setStructures] = useState([]);
  const [name, setName] = useState("");
  const [wubookKey, setWubookKey] = useState("");

  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    try {
      const response = await axios.get("/api/structures");
      setStructures(response.data);
      if (response.data.length > 0) {
        onStructureSelect(response.data[0]);
      }
    } catch (error) {
      console.error("Errore nel recupero delle strutture:", error);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/structures", { name, wubook_key: wubookKey });
      fetchStructures();
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  return (
    <Box>
      <h2>Gestione Struttura</h2>
      <TextField fullWidth label="Nome Struttura" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField fullWidth label="Wubook API Key" value={wubookKey} onChange={(e) => setWubookKey(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleSave}>Salva Struttura</Button>

      <h3>Strutture Esistenti</h3>
      <Select fullWidth onChange={(e) => onStructureSelect(structures.find(s => s.id === Number(e.target.value)))}>
        {structures.map((structure) => (
          <MenuItem key={structure.id} value={structure.id}>{structure.name}</MenuItem>
        ))}
      </Select>
    </Box>
  );
}
