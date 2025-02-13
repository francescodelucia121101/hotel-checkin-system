'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ManagerBooking() {
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const runCommand = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/run-command');
      const data = await res.json();
      setOutput(data.output);
    } catch (error) {
      setOutput('Errore nell\'esecuzione del comando');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manager Booking</h1>
      <Button onClick={runCommand} disabled={loading}>
        {loading ? 'Eseguendo...' : 'Esegui Comando'}
      </Button>
      {output && <pre className="bg-gray-100 p-4 rounded-md">{output}</pre>}
    </div>
  );
}
