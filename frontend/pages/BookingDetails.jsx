export default function BookingDetails({ booking, onClose }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Dettagli Prenotazione</h2>
        <p><strong>Ospite:</strong> {booking.guest_name}</p>
        <p><strong>Email:</strong> {booking.guest_email}</p>
        <p><strong>Check-in:</strong> {booking.checkin_date}</p>
        <p><strong>Check-out:</strong> {booking.checkout_date}</p>
        <p><strong>Numero Ospiti:</strong> {booking.guests_count}</p>
        <p><strong>Stato:</strong> {booking.status}</p>
        <p><strong>Codice Porta:</strong> {booking.door_code || "Non assegnato"}</p>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Chiudi</button>
      </div>
    </div>
  );
}
