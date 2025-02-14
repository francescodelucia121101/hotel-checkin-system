import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard";
import BookingDetails from "./booking-details";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
      </Routes>
    </Router>
  );
}
