"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import {
  Card,
  Badge,
  Button,
  PageHeader,
  EmptyState,
  LoadingScreen,
  Alert,
  DataTable,
  Th,
  RowAction,
} from "@/app/admin/components/ui";

interface ArticleItem {
  id: number;
  title: string;
  description: string | null;
  type: string | null;
  cover_url: string | null;
  file_url: string | null;
  is_lead_magnet: boolean;
  is_published: boolean;
  published_at: string | null;
}

export default function ArticleListPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getAllArticles();
      setArticles(result.articles);
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
    if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;
    try {
      await api.deleteArticle(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
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
        title="Articles"
        subtitle="Les articles du blog"
        actions={
          <Button onClick={() => router.push("/admin/article/new")}>
            <Plus className="w-4 h-4" />
            Nouvel article
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <DataTable>
            <thead>
              <tr>
                <Th>Titre</Th>
                <Th>Type</Th>
                <Th>Publié</Th>
                <Th>Lead Magnet</Th>
                <Th>Date</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-brand-50/40 transition-colors">
                  <td className="px-5 py-3.5 text-gray-900 font-medium">{article.title}</td>
                  <td className="px-5 py-3.5">
                    {article.type ? (
                      <Badge color="gray">{article.type}</Badge>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge color={article.is_published ? "green" : "amber"} dot>
                      {article.is_published ? "Publié" : "Brouillon"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge color={article.is_lead_magnet ? "purple" : "gray"} dot>
                      {article.is_lead_magnet ? "Oui" : "Non"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {article.published_at
                      ? new Date(article.published_at).toLocaleDateString("fr-FR", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <RowAction onClick={() => router.push(`/admin/article/${article.id}/edit`)} icon={Pencil}>Modifier</RowAction>
                      <RowAction onClick={() => handleDelete(article.id)} icon={Trash2} tone="danger">Supprimer</RowAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

        {articles.length === 0 && (
          <EmptyState
            title="Aucun article"
            subtitle="Créez le premier article du blog."
            icon={FileText}
          />
        )}
      </Card>
    </div>
  );
}
