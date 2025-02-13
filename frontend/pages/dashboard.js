import { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import StructureSelector from "../components/StructureSelector";
import BookingsTable from "../components/BookingsTable";
import axios from "axios";

export default function Dashboard() {
  const [structures, setStructures] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchStructures();
  }, []);

  useEffect(() => {
    if (selectedStructure) {
      fetchBookings(selectedStructure.id);
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

  const fetchBookings = async (structureId) => {
    try {
      const response = await axios.get(`/api/bookings?structure_id=${structureId}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4">Dashboard Manager</Typography>
      <StructureSelector structures={structures} onSelect={setSelectedStructure} />
      {selectedStructure && <BookingsTable bookings={bookings} />}
    </Container>
  );
}
