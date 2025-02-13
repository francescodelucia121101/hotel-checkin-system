import { useState, useEffect } from "react";
import axios from "axios";
import StructureConfig from "../components/StructureConfig";
import RoomsConfig from "../components/RoomsConfig";
import DoorsConfig from "../components/DoorsConfig";


export default function Dashboard() {
  const [tab, setTab] = useState("structure"); // Controllo delle schede
  const [structures, setStructures] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);

  useEffect(() => {
    fetchStructures();
  }, []);

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

  return (
    <div>
      <h1>Dashboard Manager</h1>

      {/* Navigazione tra schede */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setTab("structure")}>Gestione Struttura</button>
        <button onClick={() => setTab("rooms")} disabled={!selectedStructure}>
          Gestione Camere
        </button>
        <button onClick={() => setTab("doors")} disabled={!selectedStructure}>
          Gestione Porte
        </button>
      </div>

      {/* Contenuti della dashboard */}
      {tab === "structure" && <StructureConfig onStructureSelect={setSelectedStructure} />}
      {tab === "rooms" && selectedStructure && <RoomsConfig structure={selectedStructure} />}
      {tab === "doors" && selectedStructure && <DoorsConfig structure={selectedStructure} />}
    </div>
  );
}
