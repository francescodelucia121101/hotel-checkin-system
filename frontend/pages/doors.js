import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

export default function Doors() {
  const [doors, setDoors] = useState([]);
  const [newDoor, setNewDoor] = useState('');
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/doors');
        setDoors(response.data);
      } catch (error) {
        console.error('Errore nel recupero delle porte', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post('/api/doors', { name: newDoor, room_id: roomId });
      setDoors([...doors, { name: newDoor, room_id: roomId }]);
      setNewDoor('');
      setRoomId('');
    } catch (error) {
      console.error('Errore durante la creazione della porta', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Gestione Porte</Typography>
      <TextField label="Nome Porta" value={newDoor} onChange={(e) => setNewDoor(e.target.value)} fullWidth margin="normal" />
      <TextField label="ID Camera" value={roomId} onChange={(e) => setRoomId(e.target.value)} fullWidth margin="normal" />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Aggiungi Porta</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>ID Camera</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doors.map((door, index) => (
              <TableRow key={index}>
                <TableCell>{door.name}</TableCell>
                <TableCell>{door.room_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
