"use client";

import { useRouter } from "next/navigation";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Info,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(11,29,32,0.05)] ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Icon className="w-4.5 h-4.5" />
          </span>
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */

const badgeStyles: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-rose-50 text-rose-700 ring-rose-600/15",
  blue: "bg-brand-50 text-brand-700 ring-brand-600/20",
  indigo: "bg-sky-50 text-sky-700 ring-sky-600/15",
  purple: "bg-violet-50 text-violet-700 ring-violet-600/15",
  gray: "bg-gray-100 text-gray-600 ring-gray-500/15",
};

export function Badge({
  children,
  color = "gray",
  dot = false,
}: {
  children: ReactNode;
  color?: keyof typeof badgeStyles;
  dot?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${badgeStyles[color]}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

const buttonStyles: Record<string, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  secondary:
    "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
  danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
  dangerGhost: "text-rose-600 hover:bg-rose-50",
  ghost: "text-gray-600 hover:bg-gray-100",
  outline: "text-brand-700 border border-brand-200 hover:bg-brand-50",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonStyles;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${focusRing} ${buttonStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const rowActionStyles = {
  brand: "text-brand-700 hover:bg-brand-50",
  success: "text-emerald-700 hover:bg-emerald-50",
  warning: "text-amber-700 hover:bg-amber-50",
  danger: "text-rose-600 hover:bg-rose-50",
};

/** Action compacte d'une ligne de tableau. */
export function RowAction({
  icon: Icon,
  tone = "brand",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: LucideIcon;
  tone?: keyof typeof rowActionStyles;
}) {
  return (
    <button
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors ${focusRing} ${rowActionStyles[tone]}`}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Formulaires                                                         */
/* ------------------------------------------------------------------ */

const fieldClass =
  "w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-shadow hover:border-gray-300 focus:outline-none focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 disabled:bg-gray-50 disabled:text-gray-500";

export function Label({
  children,
  className = "",
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={`block text-sm font-medium text-gray-700 mb-1.5 ${className}`} {...props}>
      {children}
    </label>
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClass} ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldClass} resize-y ${className}`} {...props} />;
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${fieldClass} ${className}`} {...props} />;
}

export function Checkbox({ className = "", ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  return (
    <input
      type="checkbox"
      className={`w-4 h-4 rounded border-gray-300 accent-brand-600 ${className}`}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Alert                                                               */
/* ------------------------------------------------------------------ */

const alertStyles = {
  error: { box: "bg-rose-50 border-rose-200 text-rose-700", icon: AlertCircle },
  success: { box: "bg-emerald-50 border-emerald-200 text-emerald-700", icon: CheckCircle2 },
  info: { box: "bg-brand-50 border-brand-200 text-brand-800", icon: Info },
  warning: { box: "bg-amber-50 border-amber-200 text-amber-800", icon: TriangleAlert },
};

export function Alert({
  variant = "error",
  children,
}: {
  variant?: keyof typeof alertStyles;
  children: ReactNode;
}) {
  const { box, icon: Icon } = alertStyles[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 border text-sm rounded-xl px-4 py-3 ${box}`}
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tableaux                                                            */
/* ------------------------------------------------------------------ */

export function DataTable({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm [&_thead]:bg-gray-50/80 [&_thead]:border-b [&_thead]:border-gray-200/80 ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  align = "left",
}: {
  children?: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-3 font-semibold text-gray-500 text-[11px] uppercase tracking-wider whitespace-nowrap ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

/* ------------------------------------------------------------------ */
/* StatCard                                                            */
/* ------------------------------------------------------------------ */

const accentStyles: Record<string, string> = {
  blue: "bg-brand-50 text-brand-600",
  indigo: "bg-sky-50 text-sky-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  violet: "bg-violet-50 text-violet-600",
  cyan: "bg-cyan-50 text-cyan-600",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: keyof typeof accentStyles;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <span
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accentStyles[accent]}`}
        >
          <Icon className="w-4.5 h-4.5" />
        </span>
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900 tabular-nums leading-none">
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-gray-500">{hint}</p>}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* PageHeader                                                          */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FormPage : en-tête + retour, pour les écrans de création/édition    */
/* ------------------------------------------------------------------ */

export function FormPage({
  title,
  subtitle,
  backHref,
  children,
}: {
  title: string;
  subtitle?: string;
  backHref: string;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <div>
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className={`inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-700 rounded-lg transition-colors mb-2 ${focusRing}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
        <PageHeader title={title} subtitle={subtitle} />
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EmptyState                                                          */
/* ------------------------------------------------------------------ */

export function EmptyState({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="text-center py-14 px-6">
      <span className="inline-flex w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </span>
      <p className="text-gray-700 text-sm font-semibold">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Loading                                                             */
/* ------------------------------------------------------------------ */

export function LoadingScreen({ label = "Chargement..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3">
      <span className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
