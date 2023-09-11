import "@/styles/globals.css";
import "@smastrom/react-rating/style.css";
import { AuthContextProvider } from "@/components/context/AuthContext";
import { Navbar } from "@/components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Navbar></Navbar>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
}
