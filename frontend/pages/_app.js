import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingDetails from "./booking-details";
import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("./dashboard"), { ssr: false });


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
