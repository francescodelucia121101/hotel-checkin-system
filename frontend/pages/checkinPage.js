import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import SignaturePad from '../components/SignaturePad';

const stripePromise = loadStripe('your-publishable-key-here');

const CheckInPage = () => {
  const [guestData, setGuestData] = useState({});
  const [signature, setSignature] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Verifica se i dati della prenotazione esistono prima del pagamento
    if (guestData.reservationCode) {
      fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000 }), // Tassa di soggiorno, esempio 10€
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [guestData]);

  const handleGuestDataChange = (e) => {
    const { name, value } = e.target;
    setGuestData({ ...guestData, [name]: value });
  };

  const handleSignatureSave = (signatureData) => {
    setSignature(signatureData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const stripe = await stripePromise;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: guestData.fullName,
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        // Invio dei dati dell'ospite al backend
        const response = await fetch('/api/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...guestData, signature }),
        });

        const result = await response.json();
        alert('Check-in completato!');
      }
    }
  };

  return (
    <div className="container">
      <h1>Check-in Hotel</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Nome completo"
          value={guestData.fullName || ''}
          onChange={handleGuestDataChange}
          className="input"
        />
        <input
          type="text"
          name="reservationCode"
          placeholder="Codice prenotazione"
          value={guestData.reservationCode || ''}
          onChange={handleGuestDataChange}
          className="input"
        />
        <SignaturePad onSave={handleSignatureSave} />
        <button type="submit" className="btn">
          Concludi Check-In
        </button>
      </form>
    </div>
  );
};

export default CheckInPage;
