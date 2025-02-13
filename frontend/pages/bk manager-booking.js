import { useState, useEffect, useReducer } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { SelectTrigger } from '@shadcn/ui';

const initialState = { bookings: [], selectedBooking: null, filter: "all" };

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_BOOKINGS":
      return { ...state, bookings: action.payload };
    case "SET_SELECTED":
      return { ...state, selectedBooking: action.payload };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

const ManagerBookingCalendar = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "SET_BOOKINGS", payload: data }))
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
        dispatch({
          type: "SET_BOOKINGS",
          payload: state.bookings.map((b) => (b.id === id ? updatedBooking : b)),
        });
        dispatch({ type: "SET_SELECTED", payload: null });
      })
      .catch((err) => console.error("Errore nell'aggiornamento della prenotazione", err));
  };

  const events = state.bookings
    .filter((b) => state.filter === "all" || b.checkedIn.toString() === state.filter)
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
        <Select onValueChange={(value) => dispatch({ type: "SET_FILTER", payload: value })}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Filtra prenotazioni" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectItem value="all">Tutti</SelectItem>
      <SelectItem value="true">Check-in Effettuato</SelectItem>
      <SelectItem value="false">In Attesa di Check-in</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

      </div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height={600}
        eventClick={(info) =>
          dispatch({ type: "SET_SELECTED", payload: state.bookings.find((b) => b.id == info.event.id) })
        }
      />

      {state.selectedBooking && (
        <Modal onClose={() => dispatch({ type: "SET_SELECTED", payload: null })}>
          <h3 className="text-xl font-semibold">Modifica Prenotazione</h3>
          <Input
            type="text"
            defaultValue={state.selectedBooking.guestName}
            onChange={(e) =>
              dispatch({ type: "SET_SELECTED", payload: { ...state.selectedBooking, guestName: e.target.value } })
            }
          />
          <Input
            type="date"
            defaultValue={state.selectedBooking.checkinDate}
            onChange={(e) =>
              dispatch({ type: "SET_SELECTED", payload: { ...state.selectedBooking, checkinDate: e.target.value } })
            }
          />
          <Input
            type="date"
            defaultValue={state.selectedBooking.checkoutDate}
            onChange={(e) =>
              dispatch({ type: "SET_SELECTED", payload: { ...state.selectedBooking, checkoutDate: e.target.value } })
            }
          />
          <Button onClick={() => handleUpdateBooking(state.selectedBooking.id, state.selectedBooking)}>Salva</Button>
        </Modal>
      )}

      <h3 className="text-xl font-semibold mt-6">Dettagli Check-in</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {state.bookings.map((booking) => (
          <Card key={booking.id} className="p-4">
            <CardContent>
              <p className="text-lg font-semibold">{booking.guestName}</p>
              <p>Stanza: {booking.roomNumber}</p>
              <p>Check-in: {booking.checkinDate}</p>
              <p>Check-out: {booking.checkoutDate}</p>
              <Badge color={booking.checkedIn ? "green" : "red"}>
                {booking.checkedIn ? "Check-in effettuato" : "In attesa di Check-in"}
              </Badge>
              <Button
                className="mt-2"
                onClick={() => console.log(`Apertura stanza con Nuki per ${booking.roomNumber}`)}
              >
                Apri con Nuki
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManagerBookingCalendar;
