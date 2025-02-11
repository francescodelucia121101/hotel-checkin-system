import { useState } from 'react';

export default function CheckinPage() {
  const [guestName, setGuestName] = useState('');
  const [checkinDate, setCheckinDate] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const checkinData = { guestName, checkinDate, roomNumber };
    try {
      const response = await fetch('http://localhost:3000/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkinData),
      });

      if (response.ok) {
        setMessage('Check-in registrato con successo!');
      } else {
        setMessage('Errore nel registrare il check-in.');
      }
    } catch (error) {
      setMessage('Errore di connessione al server.');
    }
  };

  return (
    <div>
      <h2>Effettua un Check-in</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome Ospite:
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Data Check-in:
          <input
            type="date"
            value={checkinDate}
            onChange={(e) => setCheckinDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Numero Camera:
          <input
            type="number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Registrare Check-in</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
