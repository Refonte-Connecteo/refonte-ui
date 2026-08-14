"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ScrollText, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { clearSession, redirectToLogin } from "@/lib/session";
import type { AuditLog } from "@/app/admin/types";
import {
  Card,
  Badge,
  Button,
  PageHeader,
  EmptyState,
  LoadingScreen,
} from "@/app/admin/components/ui";

const EVENT_TYPES = [
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "MFA_SETUP",
  "MFA_SETUP_FAILED",
  "MFA_VERIFY_SUCCESS",
  "MFA_VERIFY_FAILED",
  "MFA_DISABLED",
  "PASSWORD_SET",
  "PASSWORD_CHANGED",
  "ADMIN_INVITED",
  "ADMIN_DEACTIVATED",
  "ADMIN_DELETED",
  "PRIVILEGED_REQUEST",
  "LOGOUT",
  "TOKEN_REFRESH",
  "TOKEN_REFRESH_FAILED",
  "AUTH_FAILED",
  "VALIDATION_REJECTED",
  "RATE_LIMITED",
  "PATH_TRAVERSAL_BLOCKED",
  "FILE_UPLOADED",
  "FILE_UPLOAD_REJECTED",
  "ERROR",
];

const PAGE_SIZE = 20;

function formatDate(value: string): string {
  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function eventBadgeColor(eventType: string): "red" | "amber" | "green" | "indigo" {
  if (
    eventType.endsWith("FAILED") ||
    eventType === "ERROR" ||
    eventType === "AUTH_FAILED" ||
    eventType === "RATE_LIMITED" ||
    eventType === "VALIDATION_REJECTED" ||
    eventType === "FILE_UPLOAD_REJECTED"
  ) {
    return "red";
  }
  if (eventType.includes("DELETE") || eventType === "MFA_DISABLED") {
    return "amber";
  }
  if (eventType === "PRIVILEGED_REQUEST" || eventType === "ADMIN_LISTED") {
    return "indigo";
  }
  return "green";
}

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [eventType, setEventType] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.getAuditLogs({
        page,
        pageSize: PAGE_SIZE,
        eventType: eventType || undefined,
        success: success || undefined,
        email: email || undefined,
        from: from || undefined,
        to: to || undefined,
      });
      setLogs(result.logs);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      if (String(err).includes("Token") || String(err).includes("401")) {
        clearSession();
        redirectToLogin("expired");
      }
    } finally {
      setLoading(false);
    }
  }, [page, eventType, success, email, from, to]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    void Promise.resolve().then(() => fetchLogs());
  }, [fetchLogs, router]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow";

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      <PageHeader
        title="Journal d'audit"
        subtitle={`${total} événement${total !== 1 ? "s" : ""} de sécurité journalisé${total !== 1 ? "s" : ""}`}
        actions={
          <Button
            variant="secondary"
            onClick={() => { setPage(1); void Promise.resolve().then(() => fetchLogs()); }}
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
        }
      />

      <Card className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label htmlFor="eventType" className="block text-xs font-medium text-gray-600 mb-1">
              Type d&apos;événement
            </label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => { setEventType(e.target.value); setPage(1); }}
              className={inputClass}
            >
              <option value="">Tous</option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="success" className="block text-xs font-medium text-gray-600 mb-1">
              Résultat
            </label>
            <select
              id="success"
              value={success}
              onChange={(e) => { setSuccess(e.target.value); setPage(1); }}
              className={inputClass}
            >
              <option value="">Tous</option>
              <option value="true">Succès</option>
              <option value="false">Échec</option>
            </select>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-600 mb-1">
              Acteur (email)
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setPage(1); }}
              placeholder="admin@connecteo.fr"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="from" className="block text-xs font-medium text-gray-600 mb-1">
              Du
            </label>
            <input
              id="from"
              type="date"
              value={from}
              onChange={(e) => { setFrom(e.target.value); setPage(1); }}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="to" className="block text-xs font-medium text-gray-600 mb-1">
              Au
            </label>
            <input
              id="to"
              type="date"
              value={to}
              onChange={(e) => { setTo(e.target.value); setPage(1); }}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={() => {
              setEventType("");
              setSuccess("");
              setEmail("");
              setFrom("");
              setTo("");
              setPage(1);
            }}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Événement</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Action</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Acteur</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Route</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">IP</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge color={eventBadgeColor(log.event_type)}>{log.event_type}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-gray-800">{log.action}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">
                    {log.actor_email ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-gray-500">
                      {log.method ? <span className="font-mono text-blue-600 mr-1">{log.method}</span> : null}
                      {log.route ?? ""}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs font-mono">{log.ip ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    {log.success ? (
                      <Badge color="green" dot>Succès{log.status_code ? ` (${log.status_code})` : ""}</Badge>
                    ) : (
                      <Badge color="red" dot>Échec{log.status_code ? ` (${log.status_code})` : ""}</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && <LoadingScreen label="Chargement des événements..." />}

        {!loading && logs.length === 0 && (
          <EmptyState
            title="Aucun événement ne correspond aux filtres"
            subtitle="Modifiez les filtres ou actualisez la liste."
            icon={ScrollText}
          />
        )}
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {page} / {totalPages} — {total} événement{total !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>
          <Button
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
