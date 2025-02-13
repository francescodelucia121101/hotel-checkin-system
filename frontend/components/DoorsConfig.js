import { useState, useEffect } from "react";
import { Button, Select, MenuItem, TextField, FormControl, InputLabel, Box } from "@mui/material";
import axios from "axios";

export default function DoorsConfig({ structure }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [integrationType, setIntegrationType] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    fetchRooms();
  }, [structure]);

  const fetchRooms = async () => {
    const response = await axios.get("/api/getRooms");
    setRooms(response.data);
  };

  return (
    <Box>
      <h2>Gestione Porte per {structure.name}</h2>
      <FormControl fullWidth>
        <InputLabel>Seleziona Camera</InputLabel>
        <Select onChange={(e) => setSelectedRoom(e.target.value)}>
          {rooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>{room.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
