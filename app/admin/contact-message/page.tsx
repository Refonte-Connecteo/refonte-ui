"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Mail, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import {
  Card,
  PageHeader,
  EmptyState,
  LoadingScreen,
  Alert,
  DataTable,
  Th,
  RowAction,
} from "@/app/admin/components/ui";

interface ContactMessageItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  message: string;
  is_read: boolean;
  submitted_at: string;
}

export default function ContactMessageListPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getAllContactMessages();
      setMessages(result.contactMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      if (String(err).includes("Token") || String(err).includes("401")) {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchData();
  }, [fetchData, router]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.markContactMessageAsRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    try {
      await api.deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Messages de contact" />

        {error && <Alert>{error}</Alert>}

        <Card className="overflow-hidden">
          <DataTable>
            <thead>
              <tr>
                <Th>Nom</Th>
                <Th>Email</Th>
                <Th>Entreprise</Th>
                <Th>Lu</Th>
                <Th>Date</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5 text-gray-900 font-medium">
                    {msg.last_name} {msg.first_name}
                  </td>
                  <td className="px-5 py-3.5 text-gray-700">{msg.email}</td>
                  <td className="px-5 py-3.5 text-gray-500">{msg.company || "—"}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        msg.is_read
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {msg.is_read ? "Lu" : "Non lu"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(msg.submitted_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <RowAction onClick={() => router.push(`/admin/contact-message/${msg.id}`)} icon={Eye}>Voir</RowAction>
                      {!msg.is_read && (
                        <RowAction onClick={() => handleMarkAsRead(msg.id)} icon={Check} tone="success">Marquer lu</RowAction>
                      )}
                      <RowAction onClick={() => handleDelete(msg.id)} icon={Trash2} tone="danger">Supprimer</RowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          {messages.length === 0 && (
            <EmptyState title="Aucun message de contact" icon={Mail} />
          )}
        </Card>
      </div>
  );
}
