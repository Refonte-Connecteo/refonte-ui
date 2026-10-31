"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ImageOff,
  MessageSquare,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { api } from "@/lib/api";
import {
  Card,
  Button,
  PageHeader,
  EmptyState,
  LoadingScreen,
  Alert,
  DataTable,
  Th,
  RowAction,
} from "@/app/admin/components/ui";

interface CeoMessageItem {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  updated_at: string;
}

export default function CeoMessageListPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<CeoMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getAllCeoMessages();
      setMessages(result.messages);
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
    void Promise.resolve().then(() => fetchData());
  }, [fetchData, router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    try {
      await api.deleteCeoMessage(id);
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
      {error && <Alert>{error}</Alert>}

      <PageHeader
        title="Messages CEO"
        subtitle="Le message du dirigeant affiché sur la page d'accueil"
        actions={
          <Button onClick={() => router.push("/admin/ceomessage/new")}>
            <Plus className="w-4 h-4" />
            Nouveau message
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <DataTable>
            <thead>
              <tr>
                <Th>Titre</Th>
                <Th>Description</Th>
                <Th>Image</Th>
                <Th>Mis à jour</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5 text-gray-900 font-medium">{msg.title}</td>
                  <td className="px-5 py-3.5 text-gray-700 max-w-xs truncate">{msg.description}</td>
                  <td className="px-5 py-3.5">
                    {msg.image_url ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        URL
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-gray-300 text-xs">
                        <ImageOff className="w-3.5 h-3.5" />
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(msg.updated_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <RowAction onClick={() => router.push(`/admin/ceomessage/${msg.id}/edit`)} icon={Pencil}>Modifier</RowAction>
                      <RowAction onClick={() => handleDelete(msg.id)} icon={Trash2} tone="danger">Supprimer</RowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

        {messages.length === 0 && (
          <EmptyState
            title="Aucun message CEO"
            subtitle="Créez le premier message du dirigeant."
            icon={MessageSquare}
          />
        )}
      </Card>
    </div>
  );
}
