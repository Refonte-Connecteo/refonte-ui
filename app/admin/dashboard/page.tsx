"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Users,
  MousePointerClick,
  Briefcase,
  Send,
  Mail,
  TrendingUp,
  Globe,
  MonitorSmartphone,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api";
import { clearSession, redirectToLogin } from "@/lib/session";
import type { AnalyticsSummary } from "@/app/admin/types";
import {
  Card,
  CardHeader,
  StatCard,
  Badge,
  Button,
  PageHeader,
  EmptyState,
  LoadingScreen,
} from "@/app/admin/components/ui";

interface AdminUser {
  id: number;
  email: string;
  username: string;
  user_type_id: number;
  is_active: boolean;
  created_at: string;
  last_login_at?: string | null;
}

const DEVICE_LABELS: Record<string, string> = {
  desktop: "Ordinateur",
  mobile: "Mobile",
  tablet: "Tablette",
};

function formatShortDate(iso: string): string {
  const [, m, d] = iso.split("-");
  const months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]}`;
}

function AnalyticsCharts({ summary }: { summary: AnalyticsSummary }) {
  const series = summary.dailySeries.map((p) => ({
    ...p,
    label: formatShortDate(p.date),
  }));

  const maxPageViews = Math.max(1, ...summary.topPages.map((p) => p.views));
  const maxReferrer = Math.max(1, ...summary.topReferrers.map((r) => r.views));
  const maxDevice = Math.max(1, ...summary.deviceBreakdown.map((d) => d.views));
  const totalDevice = summary.deviceBreakdown.reduce((acc, d) => acc + d.views, 0) || 1;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title="Visites & visiteurs uniques" subtitle="Par jour sur la période" />
        <div className="p-5">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="views" name="Visites" stroke="#2563eb" strokeWidth={2} fill="url(#viewsFill)" />
                <Area type="monotone" dataKey="visitors" name="Visiteurs uniques" stroke="#7c3aed" strokeWidth={2} fill="url(#visitorsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-blue-600" /> Visites
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-1 rounded-full bg-violet-600" /> Visiteurs uniques
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Pages les plus visitées" icon={TrendingUp} />
          <div className="p-5 space-y-3.5">
            {summary.topPages.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">Aucune donnée</p>
            )}
            {summary.topPages.map((p) => (
              <div key={p.path}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 truncate">{p.path}</span>
                  <span className="text-gray-500 tabular-nums">{p.views}</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${(p.views / maxPageViews) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader title="Sources de trafic" icon={Globe} />
          <div className="p-5 space-y-3.5">
            {summary.topReferrers.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">Accès directs uniquement</p>
            )}
            {summary.topReferrers.map((r) => (
              <div key={r.referrer}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 truncate">{r.referrer}</span>
                  <span className="text-gray-500 tabular-nums">{r.views}</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    style={{ width: `${(r.views / maxReferrer) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader title="Appareils" icon={MonitorSmartphone} />
          <div className="p-5 space-y-3.5">
            {summary.deviceBreakdown.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">Aucune donnée</p>
            )}
            {summary.deviceBreakdown.map((d) => {
              const pct = Math.round((d.views / totalDevice) * 100);
              return (
                <div key={d.device}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">
                      {DEVICE_LABELS[d.device] ?? d.device}
                    </span>
                    <span className="text-gray-500 tabular-nums">
                      {pct}% · {d.views}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{ width: `${(d.views / maxDevice) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState<{ email: string; username: string; user_type: { type: string } } | null>(null);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [range, setRange] = useState(7);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const isSuperAdmin = profile?.user_type?.type === "superAdmin";

  const fetchSummary = useCallback(
    async (rangeDays: number) => {
      setAnalyticsLoading(true);
      try {
        const { summary: data } = await api.getAnalyticsSummary(rangeDays);
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur");
      } finally {
        setAnalyticsLoading(false);
      }
    },
    []
  );

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
        clearSession();
        redirectToLogin("expired");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    void Promise.resolve().then(() => fetchData());
  }, [fetchData, router]);

  useEffect(() => {
    if (isSuperAdmin) {
      void Promise.resolve().then(() => fetchSummary(range));
    }
  }, [isSuperAdmin, range, fetchSummary]);

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

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer définitivement cet administrateur ? Cette action est irréversible.")) return;

    try {
      await api.deleteAdmin(id);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl p-4 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <PageHeader
        title="Tableau de bord"
        subtitle={isSuperAdmin ? "Trafic du site et gestion des accès" : "Gestion des administrateurs"}
        actions={
          isSuperAdmin && summary ? (
            <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-xl">
              {[7, 30].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    range === r
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {r} j
                </button>
              ))}
            </div>
          ) : undefined
        }
      />

      {isSuperAdmin && (
        <>
          {analyticsLoading && !summary ? (
            <LoadingScreen label="Chargement des statistiques..." />
          ) : summary ? (
            <>
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <StatCard label="Visites" value={summary.totalViews} hint={`${summary.rangeDays} derniers jours`} icon={Eye} accent="blue" />
                <StatCard label="Visiteurs uniques" value={summary.uniqueVisitors} hint="Identités anonymes" icon={Users} accent="indigo" />
                <StatCard label="Moy. visites / jour" value={summary.viewsPerDay} hint="Sur la période" icon={MousePointerClick} accent="violet" />
                <StatCard label="Candidatures" value={summary.counts.applications} hint="Période" icon={Briefcase} accent="emerald" />
                <StatCard label="Candidatures spont." value={summary.counts.spontaneousApplications} hint="Période" icon={Mail} accent="amber" />
                <StatCard label="Messages contact" value={summary.counts.contactMessages} hint={`${summary.counts.unreadContactMessages} non lus`} icon={Send} accent="rose" />
              </div>

              {summary.totalViews === 0 ? (
                <Card>
                  <EmptyState
                    title="Aucune donnée de trafic sur la période"
                    subtitle="Les vues du site public sont remontées automatiquement à chaque visite."
                    icon={Eye}
                  />
                </Card>
              ) : (
                <AnalyticsCharts summary={summary} />
              )}
            </>
          ) : null}
        </>
      )}

      {/* Gestion des administrateurs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Administrateurs</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {admins.length} administrateur{admins.length !== 1 ? "s" : ""}
            </p>
          </div>
          {isSuperAdmin && (
            <Button onClick={() => router.push("/admin/invite")}>
              <UserPlus className="w-4 h-4" />
              Ajouter un administrateur
            </Button>
          )}
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                    Créé le
                  </th>
                  {isSuperAdmin && (
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-900 font-medium">{admin.email}</td>
                    <td className="px-5 py-3.5 text-gray-700">{admin.username}</td>
                    <td className="px-5 py-3.5">
                      {admin.is_active ? (
                        <Badge color="green" dot>Actif</Badge>
                      ) : (
                        <Badge color="amber" dot>En attente</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {new Date(admin.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {admin.is_active ? (
                            <button
                              onClick={() => handleDeactivate(admin.id)}
                              className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                            >
                              Désactiver
                            </button>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                          <button
                            onClick={() => handleDelete(admin.id)}
                            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 text-xs font-medium px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {admins.length === 0 && (
            <EmptyState
              title="Aucun administrateur"
              subtitle="Invitez le premier administrateur pour démarrer."
              icon={Users}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
