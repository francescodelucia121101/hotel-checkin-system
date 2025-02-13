import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [nukiKey, setNukiKey] = useState('');
  const [hikvisionKey, setHikvisionKey] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/integrations');
        setIntegrations(response.data);
      } catch (error) {
        console.error('Errore nel recupero delle integrazioni', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post('/api/integrations', { nuki_key: nukiKey, hikvision_key: hikvisionKey });
      setIntegrations([...integrations, { nuki_key: nukiKey, hikvision_key: hikvisionKey }]);
      setNukiKey('');
      setHikvisionKey('');
    } catch (error) {
      console.error('Errore durante la configurazione delle integrazioni', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Integrazioni</Typography>
      <TextField label="API Key Nuki" value={nukiKey} onChange={(e) => setNukiKey(e.target.value)} fullWidth margin="normal" />
      <TextField label="API Key Hikvision" value={hikvisionKey} onChange={(e) => setHikvisionKey(e.target.value)} fullWidth margin="normal" />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Configura Integrazioni</Button>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>API Key Nuki</TableCell>
              <TableCell>API Key Hikvision</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {integrations.map((integration, index) => (
              <TableRow key={index}>
                <TableCell>{integration.nuki_key}</TableCell>
                <TableCell>{integration.hikvision_key}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
