import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function ManagerRegistration() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/register', form);
      router.push('/login');
    } catch (err) {
      setError('Errore nella registrazione');
    }
    setLoading(false);
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', marginTop: 10, padding: 3 }}>
      <CardContent>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Registrazione Manager
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            name="name"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            onChange={handleChange}
            required
          />
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : 'Registrati'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
