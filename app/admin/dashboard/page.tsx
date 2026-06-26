"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface AdminUser {
  id: number;
  email: string;
  username: string;
  user_type_id: number;
  is_active: boolean;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<{ email: string; username: string; user_type: { type: string } } | null>(null);

  const isSuperAdmin = profile?.user_type?.type === "superAdmin";

  const fetchData = useCallback(async () => {
    try {
      const [profileResult, adminsResult] = await Promise.all([
        api.getProfile(),
        api.getAllAdmins(),
      ]);
      setProfile(profileResult.user);
      setAdmins(adminsResult.users);
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

  const handleDeactivate = async (id: number) => {
    if (!confirm("Voulez-vous vraiment désactiver cet administrateur ?")) return;

    try {
      await api.deactivateAdmin(id);
      setAdmins((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_active: false } : a))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            Administration Connecteo
          </h1>
          <div className="flex items-center gap-4">
            {profile && (
              <span className="text-sm text-gray-500">
                {profile.username}{" "}
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                  {profile.user_type.type}
                </span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-4">
            {error}
          </div>
        )}

        {isSuperAdmin && (
          <div className="flex justify-end">
            <button
              onClick={() => router.push("/admin/invite")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Inviter un administrateur
            </button>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Utilisateur
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Statut
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Créé le
                </th>
                {isSuperAdmin && (
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{admin.email}</td>
                  <td className="px-4 py-3 text-gray-700">{admin.username}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        admin.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {admin.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(admin.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  {isSuperAdmin && admin.is_active && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeactivate(admin.id)}
                        className="text-red-600 hover:text-red-700 text-xs font-medium"
                      >
                        Désactiver
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {admins.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              Aucun administrateur
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
