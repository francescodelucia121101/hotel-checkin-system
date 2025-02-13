import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const response = await axios.post('/api/login', form);
      console.log('Login riuscito:', response.data);
      router.push('/dashboard'); // Reindirizza alla dashboard
    } catch (err) {
      setError('Credenziali errate');
    }
    setLoading(false);
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', marginTop: 10, padding: 3 }}>
      <CardContent>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Login Manager
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
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
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
