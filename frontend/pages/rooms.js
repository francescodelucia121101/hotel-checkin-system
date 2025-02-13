import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Rooms({ apiKey }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (apiKey) {
      fetchRooms();
    }
  }, [apiKey]);

  const fetchRooms = async () => {
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
      <button onClick={fetchRooms} disabled={loading || !apiKey}>
        {loading ? 'Caricamento...' : 'Recupera Camere'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {rooms.map((room, index) => (
          <li key={index}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
}
