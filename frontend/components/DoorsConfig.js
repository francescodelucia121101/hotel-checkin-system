import { useState, useEffect } from "react";
import axios from "axios";

export default function DoorsConfig({ structure }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [integrationType, setIntegrationType] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    fetchRooms();
  }, [structure]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("/api/getRooms");
      setRooms(response.data);
    } catch (error) {
      console.error("Errore nel recupero delle camere:", error);
    }
  };

  const handleSave = async () => {
    if (!selectedRoom || !integrationType || !apiKey) return;
    try {
      await axios.post("/api/doors", { room_id: selectedRoom, integration_type: integrationType, api_key: apiKey });
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
    }
  };

  return (
    <div>
      <h2>Gestione Porte per {structure.name}</h2>
      <select onChange={(e) => setSelectedRoom(e.target.value)}>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>{room.name}</option>
        ))}
      </select>
      <select onChange={(e) => setIntegrationType(e.target.value)}>
        <option value="HIKVISION">HIKVISION</option>
        <option value="NUKI">NUKI</option>
      </select>
      <input type="text" placeholder="API Key" onChange={(e) => setApiKey(e.target.value)} />
      <button onClick={handleSave}>Salva</button>
    </div>
  );
}
