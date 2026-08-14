"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ScrollText,
  MessageSquare,
  Image,
  BarChart3,
  Star,
  FolderOpen,
  FileText,
  CalendarDays,
  ImagePlus,
  Briefcase,
  Inbox,
  Mail,
  Send,
  Shield,
  LogOut,
  Menu,
  X,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { clearSession, redirectToLogin, type LogoutReason } from "@/lib/session";
import { useIdleTimer } from "@/app/admin/hooks/useIdleTimer";
import { SectionTitle } from "@/app/admin/components/ui";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  superAdminOnly?: boolean;
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Pilotage",
    items: [
      { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
      { href: "/admin/audit-logs", label: "Journal d'audit", icon: ScrollText, superAdminOnly: true },
    ],
  },
  {
    title: "Contenu",
    items: [
      { href: "/admin/ceomessage", label: "Messages CEO", icon: MessageSquare },
      { href: "/admin/heroslide", label: "Slides Hero", icon: Image },
      { href: "/admin/kpistat", label: "Statistiques KPI", icon: BarChart3 },
      { href: "/admin/reference", label: "Références", icon: Star },
      { href: "/admin/catalogue", label: "Catalogues", icon: FolderOpen },
      { href: "/admin/article", label: "Articles", icon: FileText },
      { href: "/admin/event", label: "Événements", icon: CalendarDays },
      { href: "/admin/event-image", label: "Images événements", icon: ImagePlus },
    ],
  },
  {
    title: "Recrutement",
    items: [
      { href: "/admin/job-posting", label: "Offres d'emploi", icon: Briefcase },
      { href: "/admin/application", label: "Candidatures", icon: Inbox },
      { href: "/admin/spontaneous-application", label: "Candidatures spontanées", icon: Mail },
    ],
  },
  {
    title: "Relation",
    items: [{ href: "/admin/contact-message", label: "Messages contact", icon: Send }],
  },
  {
    title: "Compte",
    items: [{ href: "/admin/profile", label: "Sécurité & profil", icon: Shield }],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<{
    username: string;
    email?: string;
    user_type?: { id: number; type: string };
  } | null>(null);

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/set-password";

  // Le user stocké localement n'inclut pas toujours user_type ; on rafraîchit
  // depuis le profil API pour connaître le rôle de façon fiable.
  useEffect(() => {
    if (isAuthPage) return;
    if (profile?.user_type) return;

    let cancelled = false;
    api
      .getProfile()
      .then(({ user }) => {
        if (!cancelled) setProfile(user);
      })
      .catch(() => {
        if (cancelled) return;
        clearSession();
        redirectToLogin("expired");
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, isAuthPage, profile?.user_type]);

  const isSuperAdmin = profile?.user_type?.type === "superAdmin";

  const handleLogout = async (reason: LogoutReason = "manual") => {
    try {
      await api.logout();
    } catch {
      // La session est nettoyée localement dans tous les cas.
    }
    clearSession();
    redirectToLogin(reason);
  };

  useIdleTimer({
    timeoutMs: IDLE_TIMEOUT_MS,
    enabled: !isAuthPage,
    onIdle: () => handleLogout("inactivity"),
  });

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Brand */}
        <div className="p-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Connecteo</h2>
              <p className="text-xs text-blue-100 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Administration
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.title}>
              <SectionTitle>{group.title}</SectionTitle>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  if (item.superAdminOnly && !isSuperAdmin) return null;
                  const isActive = pathname?.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-200"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                      {item.label}
                      {item.superAdminOnly && !isActive && (
                        <span className="ml-auto text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 font-semibold">
                          admin
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        {profile && (
          <div className="p-4 border-t border-gray-200 bg-gray-50/60">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                isSuperAdmin
                  ? "bg-gradient-to-br from-violet-500 to-fuchsia-500"
                  : "bg-gradient-to-br from-blue-500 to-indigo-500"
              }`}>
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{profile.username}</p>
                <p className="text-xs text-gray-500">
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleLogout()}
              className="w-full inline-flex items-center gap-2 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Connecteo Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`ml-auto text-gray-500 ${sidebarOpen ? "" : "hidden"}`}
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-5 lg:p-8 max-w-[1200px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
