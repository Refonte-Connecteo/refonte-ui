import type { Metadata } from "next";
import { Mada } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";

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
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
