"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { clearSession, redirectToLogin } from "@/lib/session";
import type { AuditLog } from "@/app/admin/types";

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

function eventBadgeClass(eventType: string): string {
  if (eventType.endsWith("FAILED") || eventType === "ERROR" || eventType === "AUTH_FAILED" || eventType === "RATE_LIMITED" || eventType === "VALIDATION_REJECTED") {
    return "bg-red-50 text-red-700 border-red-200";
  }
  if (eventType.includes("DELETE") || eventType === "MFA_DISABLED") {
    return "bg-orange-50 text-orange-700 border-orange-200";
  }
  return "bg-green-50 text-green-700 border-green-200";
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
    fetchLogs();
  }, [fetchLogs, router]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Journal d&apos;audit</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {total} événement{total !== 1 ? "s" : ""} de sécurité journalisé{total !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => { setPage(1); fetchLogs(); }}
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-4">
            {error}
          </div>
        )}

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label htmlFor="eventType" className="block text-xs font-medium text-gray-600 mb-1">
                Type d&apos;événement
              </label>
              <select
                id="eventType"
                value={eventType}
                onChange={(e) => { setEventType(e.target.value); setPage(1); }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Événement</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Action</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Acteur</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Route</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">IP</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-gray-600 text-xs uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${eventBadgeClass(log.event_type)}`}>
                        {log.event_type}
                      </span>
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          Succès{log.status_code ? ` (${log.status_code})` : ""}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          Échec{log.status_code ? ` (${log.status_code})` : ""}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="text-center py-10 text-gray-500 text-sm">Chargement des événements...</div>
          )}

          {!loading && logs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Aucun événement ne correspond aux filtres</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} / {totalPages} — {total} événement{total !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Précédent
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Suivant
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
