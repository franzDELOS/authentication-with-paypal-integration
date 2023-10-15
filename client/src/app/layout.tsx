"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./shared/components/Navbar";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialOptions = {
    clientId:
      "AXRnjWRmCxL-tlyGShi5ZIcxoJdiuzFx978RlrU9uC9-CFyax4MHicWRlxoWzBAbqm57Ly2hf_PCRdh1",
    currency: "USD",
    intent: "capture",
  };

  const router = useRouter();

  const [auth, setAuth] = useState(false);

  axios.defaults.withCredentials = true;

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}`)
      .then((res) => {
        if (res.data.success === "Success") {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch((err) => console.log(err));
  }, [auth]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <PayPalScriptProvider options={initialOptions}>
          <div>
            <Navbar />
            {children}
          </div>
          <ToastContainer />
        </PayPalScriptProvider>
      </body>
    </html>
  );
}
