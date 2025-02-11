import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const ManagerBookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Errore nel recupero delle prenotazioni", err));
  }, []);

  const handleUpdateBooking = (id, updates) => {
    fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
      .then((updatedBooking) => {
        setBookings((prev) => prev.map((b) => (b.id === id ? updatedBooking : b)));
      })
      .catch((err) => console.error("Errore nell'aggiornamento della prenotazione", err));
  };

  const events = bookings
    .filter((booking) => filter === "all" || booking.checkedIn.toString() === filter)
    .map((booking) => ({
      id: booking.id,
      title: `${booking.guestName} - Stanza ${booking.roomNumber}`,
      start: booking.checkinDate,
      end: booking.checkoutDate,
      color: booking.checkedIn ? "#4CAF50" : "#F44336",
    }));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Calendario Prenotazioni</h2>
      <div className="flex gap-4 mb-4">
        <Select onChange={(e) => setFilter(e.target.value)}>
          <SelectItem value="all">Tutti</SelectItem>
          <SelectItem value="true">Check-in Effettuato</SelectItem>
          <SelectItem value="false">In Attesa di Check-in</SelectItem>
        </Select>
      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height={600}
        eventClick={(info) => setSelectedBooking(bookings.find((b) => b.id == info.event.id))}
      />

      {selectedBooking && (
        <div className="mt-6 p-4 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Modifica Prenotazione</h3>
          <Input
            type="text"
            defaultValue={selectedBooking.guestName}
            onChange={(e) => setSelectedBooking({ ...selectedBooking, guestName: e.target.value })}
          />
          <Input
            type="date"
            defaultValue={selectedBooking.checkinDate}
            onChange={(e) => setSelectedBooking({ ...selectedBooking, checkinDate: e.target.value })}
          />
          <Input
            type="date"
            defaultValue={selectedBooking.checkoutDate}
            onChange={(e) => setSelectedBooking({ ...selectedBooking, checkoutDate: e.target.value })}
          />
          <Button onClick={() => handleUpdateBooking(selectedBooking.id, selectedBooking)}>Salva</Button>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-6">Dettagli Check-in</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="p-4">
            <CardContent>
              <p className="text-lg font-semibold">{booking.guestName}</p>
              <p>Stanza: {booking.roomNumber}</p>
              <p>Check-in: {booking.checkinDate}</p>
              <p>Check-out: {booking.checkoutDate}</p>
              <Badge color={booking.checkedIn ? "green" : "red"}>
                {booking.checkedIn ? "Check-in effettuato" : "In attesa di check-in"}
              </Badge>
              <Button className="mt-2" onClick={() => console.log(`Apertura stanza con Nuki per ${booking.roomNumber}`)}>Apri con Nuki</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManagerBookingCalendar;
