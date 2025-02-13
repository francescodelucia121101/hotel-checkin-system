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
      fetchRooms(selectedStructure.api_key);
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

  const fetchRooms = async (apiKey) => {
    if (!apiKey) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/rooms', {
        wubook_api_key: apiKey
      });
      if (response.data.rooms && response.data.rooms.length > 0) {
        setRooms(response.data.rooms);
      } else {
        setError('Nessuna camera trovata su Wubook');
      }
    } catch (error) {
      setError('Errore nel recupero delle camere da Wubook');
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
        {rooms.map((room, index) => (
          <li key={index}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
}
