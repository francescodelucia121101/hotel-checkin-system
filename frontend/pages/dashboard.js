import { useState, useEffect } from "react";
import { Container, Tabs, Tab, Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import StructureConfig from "../components/StructureConfig";
import RoomsConfig from "../components/RoomsConfig";
import DoorsConfig from "../components/DoorsConfig";
import IntegrationsConfig from "../components/IntegrationsConfig";
import axios from "axios";

export default function Dashboard() {
  const [tab, setTab] = useState(0);
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
    <Container maxWidth="xl" sx={{ display: "flex" }}>
      <Sidebar setTab={setTab} />
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <h1>Dashboard Manager</h1>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
          <Tab label="Gestione Struttura" />
          <Tab label="Gestione Camere" disabled={!selectedStructure} />
          <Tab label="Gestione Porte" disabled={!selectedStructure} />
          <Tab label="Integrazioni" />
        </Tabs>

        <Box sx={{ mt: 4 }}>
          {tab === 0 && <StructureConfig onStructureSelect={setSelectedStructure} />}
          {tab === 1 && selectedStructure && <RoomsConfig structure={selectedStructure} />}
          {tab === 2 && selectedStructure && <DoorsConfig structure={selectedStructure} />}
          {tab === 3 && <IntegrationsConfig />}
        </Box>
      </Box>
    </Container>
  );
}
