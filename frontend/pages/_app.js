import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingDetails from "./booking-details";
import dynamic from "next/dynamic";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("./dashboard"), { ssr: false });

export default function App() {
  return <Dashboard />;
}

      </Routes>
    </Router>
  );
}
