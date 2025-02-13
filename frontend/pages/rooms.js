import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    if (!apiKey) {
      setError('Inserisci la Wubook API Key');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/rooms', {
        wubook_api_key: apiKey
      });
      setRooms(response.data.rooms || []);
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
      <input 
        type="text" 
        placeholder="Inserisci la Wubook API Key" 
        value={apiKey} 
        onChange={(e) => setApiKey(e.target.value)} 
      />
      <button onClick={fetchRooms} disabled={loading}>
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
