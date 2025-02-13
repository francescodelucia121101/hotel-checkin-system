import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Doors() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [integrationType, setIntegrationType] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/getRooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Errore nel recupero delle camere:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedRoom || !integrationType || !apiKey) {
      setMessage({ type: 'error', text: 'Tutti i campi sono obbligatori' });
      return;
    }

    try {
      const response = await axios.post('/api/doors', {
        room_id: selectedRoom,
        integration_type: integrationType,
        api_key: apiKey
      });

      setMessage({ type: 'success', text: response.data.message });
      setSelectedRoom('');
      setIntegrationType('');
      setApiKey('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Errore nel salvataggio' });
      console.error('Errore:', error);
    }
  };

  return (
    <div>
      <h1>Gestione Porte</h1>
      {message && <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</p>}
      <label>Seleziona Camera:</label>
      <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
        <option value="">-- Seleziona una Camera --</option>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>{room.name}</option>
        ))}
      </select>

      <label>Tipo di Integrazione:</label>
      <select value={integrationType} onChange={(e) => setIntegrationType(e.target.value)}>
        <option value="">-- Seleziona un'Integrazione --</option>
        <option value="HIKVISION">HIKVISION</option>
        <option value="NUKI">NUKI</option>
      </select>

      <label>API Key:</label>
      <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Inserisci API Key" />

      <button onClick={handleSave}>Salva</button>
    </div>
  );
}
