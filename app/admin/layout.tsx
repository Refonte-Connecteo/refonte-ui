import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration - Connecteo",
  description: "Interface d'administration Connecteo",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
