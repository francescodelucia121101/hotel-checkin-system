export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Simula una risposta con dati fittizi
      const bookings = [{ id: 1, guest: 'Mario Rossi', room: 101 }];
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Errore nel recupero delle prenotazioni' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
