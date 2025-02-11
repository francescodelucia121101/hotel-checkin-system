import { useState, useEffect } from 'react';

const ManagerSettingsPage = () => {
  const [hotelData, setHotelData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Carica i dati del manager dopo l'accesso
    const fetchData = async () => {
      const response = await fetch('/api/manager/settings');
      const result = await response.json();
      setHotelData(result);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/manager/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hotelData),
    });

    const result = await response.json();
    if (response.ok) {
      setMessage('Impostazioni aggiornate con successo!');
    } else {
      setMessage(result.message || 'Errore nell\'aggiornamento');
    }
  };

  return (
    <div className="container">
      <h1>Impostazioni Hotel</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="hotelName"
          value={hotelData.hotelName || ''}
          onChange={handleChange}
          placeholder="Nome Hotel"
          className="input"
        />
        <input
          type="text"
          name="wubookApiKey"
          value={hotelData.wubookApiKey || ''}
          onChange={handleChange}
          placeholder="Wubook API Key"
          className="input"
        />
        <input
          type="text"
          name="stripeApiKey"
          value={hotelData.stripeApiKey || ''}
          onChange={handleChange}
          placeholder="Stripe API Key"
          className="input"
        />
        <input
          type="text"
          name="hikvisionApiKey"
          value={hotelData.hikvisionApiKey || ''}
          onChange={handleChange}
          placeholder="HIKVISION API Key"
          className="input"
        />
        <button type="submit" className="btn">Aggiorna Impostazioni</button>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default ManagerSettingsPage;
