import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

export default function Structure() {
  const [structures, setStructures] = useState([]);
  const [newStructure, setNewStructure] = useState('');
  const [wubookKey, setWubookKey] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/structure');
        setStructures(response.data);
      } catch (error) {
        console.error('Errore nel recupero delle strutture', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post('/api/structure', { name: newStructure, wubook_key: wubookKey });
      setStructures([...structures, { name: newStructure, wubook_key: wubookKey }]);
      setNewStructure('');
      setWubookKey('');
    } catch (error) {
      console.error('Errore durante la creazione della struttura', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Gestione Strutture</Typography>
      <TextField label="Nome Struttura" value={newStructure} onChange={(e) => setNewStructure(e.target.value)} fullWidth margin="normal" />
      <TextField label="Chiave API Wubook" value={wubookKey} onChange={(e) => setWubookKey(e.target.value)} fullWidth margin="normal" />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Aggiungi Struttura</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Chiave Wubook</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {structures.map((str, index) => (
              <TableRow key={index}>
                <TableCell>{str.name}</TableCell>
                <TableCell>{str.wubook_key}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
