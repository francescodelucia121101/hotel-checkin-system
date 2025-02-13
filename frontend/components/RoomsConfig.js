import { useState, useEffect } from "react";
import { Button, List, ListItem, CircularProgress, Box } from "@mui/material";
import axios from "axios";

export default function RoomsConfig({ structure }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [structure]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("/api/getRooms");
      setRooms(response.data);
    } catch (error) {
      console.error("Errore nel recupero delle camere:", error);
    }
  };

  const syncRooms = async () => {
    setLoading(true);
    try {
      await axios.post("/api/rooms", { wubook_api_key: structure.wubook_key });
      fetchRooms();
    } catch (error) {
      console.error("Errore nella sincronizzazione delle camere:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <h2>Gestione Camere per {structure.name}</h2>
      <Button variant="contained" onClick={syncRooms} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Sincronizza Camere"}
      </Button>
      <List>
        {rooms.map((room) => (
          <ListItem key={room.id}>{room.name}</ListItem>
        ))}
      </List>
    </Box>
  );
}
