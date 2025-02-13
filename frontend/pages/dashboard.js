import { useRouter } from 'next/router';
import { Button, Typography, Container } from '@mui/material';

export default function Dashboard() {
  const router = useRouter();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Dashboard del Manager</Typography>
      <Typography variant="body1">Benvenuto! Qui puoi gestire la tua struttura.</Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => router.push('/structure')}>
        Gestione Struttura
      </Button>
      <Button variant="contained" color="primary" sx={{ mt: 2, ml: 2 }} onClick={() => router.push('/rooms')}>
        Gestione Camere
      </Button>
      <Button variant="contained" color="primary" sx={{ mt: 2, ml: 2 }} onClick={() => router.push('/doors')}>
        Gestione Porte
      </Button>
      <Button variant="contained" color="primary" sx={{ mt: 2, ml: 2 }} onClick={() => router.push('/integrations')}>
        Integrazioni Nuki / Hikvision
      </Button>
    </Container>
  );
}
