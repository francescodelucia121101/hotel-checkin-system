import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_tuaChiaveStripe");

export default function Payments() {
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const response = await axios.post("/api/payments", { amount });
    const { clientSecret } = response.data;
    await stripe.redirectToCheckout({ sessionId: clientSecret });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Pagamento Tassa di Soggiorno</Typography>
      <TextField fullWidth label="Importo (€)" type="number" onChange={(e) => setAmount(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handlePayment}>Paga ora</Button>
    </Container>
  );
}
