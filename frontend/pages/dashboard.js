import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Typography, Container, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Controlla se l'utente è autenticato
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user);
      } catch (error) {
        router.push('/login'); // Se non autenticato, reindirizza al login
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard del Manager</Typography>
      <Typography variant="body1">Benvenuto, {user ? user.name : 'Manager'}!</Typography>
      <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={() => router.push('/structure')}>
        Gestione Struttura
      </Button>
      <Button variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={() => router.push('/rooms')}>
        Gestione Camere
      </Button>
      <Button variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={() => router.push('/doors')}>
        Gestione Porte
      </Button>
      <Button variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={() => router.push('/integrations')}>
        Integrazioni Nuki / Hikvision
      </Button>
    </Container>
  );
}
