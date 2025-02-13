import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Rooms() {
  const [structures, setStructures] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStructures();
  }, []);

  useEffect(() => {
    if (selectedStructure) {
      fetchRooms();
    }
  }, [selectedStructure]);

  const fetchStructures = async () => {
    try {
      const response = await axios.get('/api/structures');
      setStructures(response.data);
      if (response.data.length > 0) {
        setSelectedStructure(response.data[0]);
      }
    } catch (error) {
      console.error('Errore nel recupero delle strutture:', error);
      setError('Errore nel recupero delle strutture');
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/getRooms');
      console.log("Camere recuperate dal database:", response.data); // DEBUG
      if (response.data.length > 0) {
        setRooms(response.data);
      } else {
        setError('Nessuna camera trovata nel database');
      }
    } catch (error) {
      setError('Errore nel recupero delle camere dal database');
      console.error('Errore:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Gestione Camere</h1>
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
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
}
