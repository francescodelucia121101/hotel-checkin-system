import { useState } from 'react';
import { useForm } from 'react-hook-form';

const ManagerRegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/manager/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Registrazione completata con successo!');
      } else {
        setMessage(result.message || 'Si è verificato un errore');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Errore nella registrazione');
    }
    setIsLoading(false);
  };

  return (
    <div className="container">
      <h1>Registrazione Manager Hotel</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          {...register('hotelName', { required: true })}
          placeholder="Nome dell'Hotel"
          className="input"
        />
        {errors.hotelName && <span>Nome dell'hotel è obbligatorio</span>}

        <input
          type="email"
          {...register('managerEmail', { required: true })}
          placeholder="Email del Manager"
          className="input"
        />
        {errors.managerEmail && <span>Email è obbligatoria</span>}

        <input
          type="password"
          {...register('password', { required: true })}
          placeholder="Password"
          className="input"
        />
        {errors.password && <span>La password è obbligatoria</span>}

        <input
          type="text"
          {...register('wubookApiKey', { required: true })}
          placeholder="Wubook API Key"
          className="input"
        />
        {errors.wubookApiKey && <span>API Key di Wubook è obbligatoria</span>}

        <input
          type="text"
          {...register('stripeApiKey', { required: true })}
          placeholder="Stripe API Key"
          className="input"
        />
        {errors.stripeApiKey && <span>API Key di Stripe è obbligatoria</span>}

        <input
          type="text"
          {...register('hikvisionApiKey', { required: true })}
          placeholder="HIKVISION API Key"
          className="input"
        />
        {errors.hikvisionApiKey && <span>API Key di HIKVISION è obbligatoria</span>}

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Registrazione in corso...' : 'Registrati'}
        </button>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default ManagerRegisterPage;
