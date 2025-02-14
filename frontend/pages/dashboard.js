import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  const [structures, setStructures] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState("prossime");

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
    }
  };

  const fetchBookings = async (structureId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bookings?structure_id=${structureId}&filter=${filter}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error);
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
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="prossime">Prossime</option>
        <option value="passate">Passate</option>
      </select>

      {loading ? <p>Caricamento...</p> : (
        <table>
          <thead>
            <tr>
              <th>Ospite</th>
              <th>Email</th>
              <th>Data Inizio</th>
              <th>Data Fine</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} onClick={() => setSelectedBooking(booking)} style={{ cursor: 'pointer' }}>
                <td>{booking.guest_name}</td>
                <td>{booking.guest_email}</td>
                <td>{booking.start_date}</td>
                <td>{booking.end_date}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
