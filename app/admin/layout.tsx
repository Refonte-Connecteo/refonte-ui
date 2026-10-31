"use client";

import { useState, useEffect, Fragment } from "react";
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
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { clearSession, redirectToLogin, type LogoutReason } from "@/lib/session";
import { useIdleTimer } from "@/app/admin/hooks/useIdleTimer";
import Logo from "@/app/admin/components/Logo";

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

const matchesRoute = (pathname: string | null, href: string) =>
  pathname === href || !!pathname?.startsWith(`${href}/`);

/** Fil d'Ariane déduit de la navigation : section > page > sous-page. */
function getBreadcrumb(pathname: string | null): string[] {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (!matchesRoute(pathname, item.href)) continue;
      const crumbs = [group.title, item.label];
      if (pathname?.endsWith("/new")) crumbs.push("Nouveau");
      else if (pathname?.endsWith("/edit")) crumbs.push("Modifier");
      else if (pathname !== item.href) crumbs.push("Détail");
      return crumbs;
    }
  }
  if (pathname === "/admin/invite") return ["Pilotage", "Ajouter un administrateur"];
  return ["Administration"];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<{
    username: string;
    email?: string;
    user_type?: { id: number; type: string };
    force_password_change?: boolean;
  } | null>(null);

  const isAuthPage = pathname === "/admin/login" || pathname === "/admin/set-password" || pathname === "/admin/force-change-password";

  // Le user stocké localement n'inclut pas toujours user_type ; on rafraîchit
  // depuis le profil API pour connaître le rôle de façon fiable.
  useEffect(() => {
    if (isAuthPage) return;
    if (profile?.user_type) return;

    let cancelled = false;
    api
      .getProfile()
      .then(({ user }) => {
        if (cancelled) return;
        setProfile(user);
        if (user.force_password_change && pathname !== "/admin/force-change-password") {
          window.location.href = "/admin/force-change-password";
        }
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

  const breadcrumb = getBreadcrumb(pathname);
  const initial = profile?.username.charAt(0).toUpperCase();
  const roleLabel = isSuperAdmin ? "Super Admin" : "Admin";

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-30 h-screen w-68 shrink-0 bg-ink text-gray-300 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Brand */}
        <div className="px-5 pt-6 pb-4 flex items-start justify-between gap-2">
          <div>
            <Logo className="h-10 w-auto" />
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-300">
              Administration
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white p-1"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-4 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 pt-5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  if (item.superAdminOnly && !isSuperAdmin) return null;
                  const isActive = matchesRoute(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => { router.push(item.href); setSidebarOpen(false); }}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                        isActive
                          ? "bg-brand-500/15 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand-400" />
                      )}
                      <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-brand-300" : "text-gray-500"}`} />
                      {item.label}
                      {item.superAdminOnly && (
                        <span className="ml-auto text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-white/10 text-gray-400 font-semibold">
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
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center gap-3 px-2 py-1.5">
              <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white text-sm truncate">{profile.username}</p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
              <button
                onClick={() => handleLogout()}
                title="Déconnexion"
                aria-label="Déconnexion"
                className="p-2 rounded-lg text-gray-400 hover:text-rose-300 hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header className="sticky top-0 z-10 h-16 shrink-0 bg-white/85 backdrop-blur border-b border-gray-200/80 px-4 lg:px-8 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="lg:hidden">
            <Logo className="h-7 w-auto" />
          </div>
          <nav aria-label="Fil d'Ariane" className="hidden lg:flex items-center gap-1.5 text-sm min-w-0">
            {breadcrumb.map((crumb, index) => (
              <Fragment key={crumb}>
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />}
                <span className={`truncate ${index === breadcrumb.length - 1 ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                  {crumb}
                </span>
              </Fragment>
            ))}
          </nav>
          {profile && (
            <button
              onClick={() => router.push("/admin/profile")}
              className="ml-auto flex items-center gap-2.5 rounded-full p-1 sm:pr-3 hover:bg-gray-100 transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                {initial}
              </span>
              <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-40 truncate">
                {profile.username}
              </span>
            </button>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
