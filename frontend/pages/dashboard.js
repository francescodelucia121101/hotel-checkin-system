import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [structures, setStructures] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      console.error("❌ Errore nel recupero delle strutture:", error);
      setError("Errore nel recupero delle strutture");
    }
  };

  const fetchBookings = async (structureId, apiKey) => {
    try {
      setLoading(true);
      await axios.post("/api/bookings", { wubook_api_key: apiKey });
      const response = await axios.get(`/api/bookings?structure_id=${structureId}`);
      setBookings(response.data);
    } catch (error) {
      console.error("❌ Errore nel recupero delle prenotazioni:", error);
      setError("Errore nel recupero delle prenotazioni");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      
      <label>Seleziona Struttura:</label>
      <select 
        onChange={(e) => setSelectedStructure(structures.find(s => s.id === Number(e.target.value)))}
        value={selectedStructure ? selectedStructure.id : ''}
      >
        {structures.map((structure) => (
          <option key={structure.id} value={structure.id}>{structure.name}</option>
        ))}
      </select>

      {loading && <p>Caricamento...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Prossime Prenotazioni</h2>
      <table>
        <thead>
          <tr>
            <th>Ospite</th>
            <th>Email</th>
            <th>Data Check-in</th>
            <th>Data Check-out</th>
            <th>Stato</th>
            <th>Codice Porta</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.guest_name}</td>
              <td>{booking.guest_email}</td>
              <td>{new Date(booking.checkin_date).toLocaleDateString()}</td>
              <td>{new Date(booking.checkout_date).toLocaleDateString()}</td>
              <td>{booking.status}</td>
              <td>{booking.door_code || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
