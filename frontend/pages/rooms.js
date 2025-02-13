import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/rooms', {
          structure_id: 1, // Assicurati che l'ID della struttura sia corretto
          wubook_user: "USERNAME_WUBOOK",
          wubook_password: "PASSWORD_WUBOOK"
        });
        setRooms(response.data);
      } catch (error) {
        console.error('Errore nel recupero delle camere', error);
        setError('Errore nel recupero delle camere');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Gestione Camere</h1>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.name}</li>
        ))}
      </ul>
    </div>
  );
}
