import { useRouter } from "next/router";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

export default function BookingsTable({ bookings }) {
  const router = useRouter();

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Numero Ospiti</TableCell>
            <TableCell>Data Inizio</TableCell>
            <TableCell>Data Fine</TableCell>
            <TableCell>Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.guests_count}</TableCell>
              <TableCell>{booking.start_date}</TableCell>
              <TableCell>{booking.end_date}</TableCell>
              <TableCell>
                <Button variant="contained" onClick={() => router.push(`/bookingDetails?id=${booking.id}`)}>
                  Dettagli
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
