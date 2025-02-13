export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, password } = req.body;

      // Simulazione di salvataggio nel database (da sostituire con la tua logica)
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
      }

      console.log("Nuovo manager registrato:", { name, email });

      return res.status(201).json({ message: 'Registrazione completata' });
    } catch (error) {
      return res.status(500).json({ error: 'Errore interno del server' });
    }
  } else {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }
}
