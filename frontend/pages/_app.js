import "../styles/globals.css"; // Importa gli stili globali
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Importa i componenti con il rendering lato client
const Dashboard = dynamic(() => import("./dashboard"), { ssr: false });
const BookingDetails = dynamic(() => import("./booking-details"), { ssr: false });

export default function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Caricamento...</div>; // Evita il rendering lato server
  }

  return (
    <div>
      {router.pathname === "/dashboard" && <Dashboard />}
      {router.pathname.startsWith("/booking") && <BookingDetails />}
      <Component {...pageProps} />
    </div>
  );
}
