import { useState, useEffect } from "react";
import axios from "axios";

export default function StructureConfig({ onStructureSelect }) {
  const [structures, setStructures] = useState([]);
  const [name, setName] = useState("");
  const [wubookKey, setWubookKey] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchStructures();
  }, []);

  const fetchStructures = async () => {
    try {
      const response = await axios.get("/api/structures");
      setStructures(response.data);
      if (response.data.length > 0) {
        onStructureSelect(response.data[0]);
      }
    } catch (error) {
      console.error("Errore nel recupero delle strutture:", error);
    }
  };

  const handleSave = async () => {
    if (!name || !wubookKey) {
      setMessage({ type: "error", text: "Tutti i campi sono obbligatori" });
      return;
    }

    try {
      const response = await axios.post("/api/structures", {
        name,
        wubook_key: wubookKey,
      });
      setMessage({ type: "success", text: response.data.message });
      fetchStructures();
    } catch (error) {
      setMessage({ type: "error", text: "Errore nel salvataggio" });
      console.error("Errore:", error);
    }
  };

  return (
    <div>
      <h2>Gestione Struttura</h2>
      {message && <p style={{ color: message.type === "error" ? "red" : "green" }}>{message.text}</p>}
      <input type="text" placeholder="Nome Struttura" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Wubook API Key" value={wubookKey} onChange={(e) => setWubookKey(e.target.value)} />
      <button onClick={handleSave}>Salva</button>

      <h3>Strutture Esistenti</h3>
      <select onChange={(e) => onStructureSelect(structures.find(s => s.id === Number(e.target.value)))}>
        {structures.map((structure) => (
          <option key={structure.id} value={structure.id}>{structure.name}</option>
        ))}
      </select>
    </div>
  );
}
