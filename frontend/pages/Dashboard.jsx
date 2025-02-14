import { useState, useEffect } from "react";
import axios from "axios";
import BookingDetails from "./BookingDetails";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("prossime");

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 300000); // Aggiorna ogni 5 minuti
    return () => clearInterval(interval);
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/bookings?filter=${filter}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Errore nel recupero delle prenotazioni:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestione Prenotazioni</h1>
      
      <div className="mb-4">
        <label className="mr-2">Filtra:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border">
          <option value="prossime">Prossime</option>
          <option value="passate">Passate</option>
        </select>
      </div>

      {loading && <p>Caricamento...</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Ospite</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Check-in</th>
            <th className="border p-2">Check-out</th>
            <th className="border p-2">Numero Ospiti</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="cursor-pointer hover:bg-gray-200" onClick={() => setSelectedBooking(booking)}>
              <td className="border p-2">{booking.guest_name}</td>
              <td className="border p-2">{booking.guest_email}</td>
              <td className="border p-2">{booking.checkin_date}</td>
              <td className="border p-2">{booking.checkout_date}</td>
              <td className="border p-2">{booking.guests_count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedBooking && <BookingDetails booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
    </div>
  );
}
