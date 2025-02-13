import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState('');
  const [structureId, setStructureId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Errore nel recupero delle camere', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post('/api/rooms', { name: newRoom, structure_id: structureId });
      setRooms([...rooms, { name: newRoom, structure_id: structureId }]);
      setNewRoom('');
      setStructureId('');
    } catch (error) {
      console.error('Errore durante la creazione della camera', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Gestione Camere</Typography>
      <TextField label="Nome Camera" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} fullWidth margin="normal" />
      <TextField label="ID Struttura" value={structureId} onChange={(e) => setStructureId(e.target.value)} fullWidth margin="normal" />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Aggiungi Camera</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>ID Struttura</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room, index) => (
              <TableRow key={index}>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.structure_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
