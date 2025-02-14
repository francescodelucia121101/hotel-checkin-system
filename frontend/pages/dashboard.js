import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [structures, setStructures] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("prossime");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStructures();
  }, []);

  useEffect(() => {
    if (selectedStructure) {
      fetchBookings(selectedStructure.id);
    }
  }, [selectedStructure, filter]);

  const fetchStructures = async () => {
    try {
      const response = await axios.get("/api/structures");
      setStructures(response.data);
      if (response.data.length > 0) {
        setSelectedStructure(response.data[0]);
      }
    } catch (error) {
      console.error("Errore nel recupero delle strutture:", error);
      setError("Errore nel recupero delle strutture");
    }
  };

  const fetchBookings = async (structureId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bookings`, {
        params: { structure_id: structureId, filter },
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error);
      setError("Errore nel recupero delle prenotazioni");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Dashboard Prenotazioni</h1>
      <label>Seleziona Struttura:</label>
      <select onChange={(e) => setSelectedStructure(structures.find(s => s.id === Number(e.target.value)))}>
        {structures.map((structure) => (
          <option key={structure.id} value={structure.id}>{structure.name}</option>
        ))}
      </select>

      <label>Filtra Prenotazioni:</label>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="prossime">Prossime</option>
        <option value="passate">Passate</option>
      </select>

      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table>
        <thead>
          <tr><th>Ospite</th><th>Check-in</th><th>Check-out</th></tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}><td>{booking.guest_name}</td><td>{booking.checkin_date}</td><td>{booking.checkout_date}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
