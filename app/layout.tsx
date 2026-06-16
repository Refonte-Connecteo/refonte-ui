import type { Metadata } from "next";
import { Mada } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const mada = Mada({
  variable: "--font-mada",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Connecteo",
  description: "Refonte UI Connecteo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${mada.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
