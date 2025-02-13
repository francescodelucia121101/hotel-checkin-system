import { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

export default function ManagerBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commandOutput, setCommandOutput] = useState('');
  const [customCommand, setCustomCommand] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Errore nel recupero delle prenotazioni', error);
    } finally {
      setLoading(false);
    }
  };

  const executeCommand = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/execute-command', { command: customCommand });
      setCommandOutput(response.data.output);
    } catch (error) {
      setCommandOutput(`Errore nell'esecuzione del comando: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Gestione Prenotazioni</Typography>
      <Button variant="contained" color="primary" onClick={fetchBookings} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Aggiorna Prenotazioni'}
      </Button>
      
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Data Check-in</TableCell>
              <TableCell>Data Check-out</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.name}</TableCell>
                <TableCell>{booking.email}</TableCell>
                <TableCell>{booking.checkinDate}</TableCell>
                <TableCell>{booking.checkoutDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Typography variant="h6" sx={{ marginTop: 3 }}>Esegui Comando Personalizzato</Typography>
      <TextField 
        fullWidth 
        variant="outlined" 
        label="Comando" 
        value={customCommand} 
        onChange={(e) => setCustomCommand(e.target.value)}
      />
      <Button variant="contained" color="secondary" sx={{ marginTop: 1 }} onClick={executeCommand} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Esegui Comando'}
      </Button>
      <Typography variant="body1" sx={{ marginTop: 2 }}>{commandOutput}</Typography>
    </Container>
  );
}
