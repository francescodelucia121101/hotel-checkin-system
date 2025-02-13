import { useState, useEffect } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import StructureSelector from "../components/StructureSelector";
import BookingsTable from "../components/BookingsTable";
import axios from "axios";

export default function Dashboard() {
  const [structures, setStructures] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStructures();
  }, []);

  useEffect(() => {
    if (selectedStructure) {
      fetchBookings(selectedStructure.id, selectedStructure.wubook_key);
    }
  }, [selectedStructure]);

  const fetchStructures = async () => {
    try {
      const response = await axios.get("/api/structures");
      setStructures(response.data);
      if (response.data.length > 0) {
        setSelectedStructure(response.data[0]);
      }
    } catch (error) {
      console.error("Errore nel recupero delle strutture:", error);
    }
  };

const fetchBookings = async (structureId, wubookKey) => {
  if (!wubookKey) return;
  setLoading(true);
  try {
    console.log("Chiamata API per prenotazioni:", { structureId, wubookKey });

    const postResponse = await axios.post("/api/bookings", { structure_id: structureId, wubook_api_key: wubookKey });
    console.log("Risposta POST bookings:", postResponse.data);

    const response = await axios.get(`/api/bookings?structure_id=${structureId}`);
    console.log("Risposta GET bookings:", response.data);

    setBookings(response.data);
  } catch (error) {
    console.error("Errore nel recupero delle prenotazioni:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Container maxWidth="xl">
      <Typography variant="h4">Dashboard Manager</Typography>
      <StructureSelector structures={structures} onSelect={setSelectedStructure} />
      <Button variant="contained" color="primary" onClick={() => fetchBookings(selectedStructure.id, selectedStructure.wubook_key)}>
        Sincronizza Prenotazioni
      </Button>
      {loading && <Typography>Caricamento...</Typography>}
      {selectedStructure && <BookingsTable bookings={bookings} />}
    </Container>
  );
}
