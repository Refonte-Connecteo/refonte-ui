import type { ReactNode } from "react";
import Logo from "@/app/admin/components/Logo";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] bg-white">
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-ink p-12 xl:p-16 text-white">
        <div
          aria-hidden
          className="absolute -top-32 -left-24 w-[32rem] h-[32rem] rounded-full bg-brand-500/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-brand-500/10 blur-3xl"
        />

        <Logo className="relative h-14 w-auto self-start" />
        <div className="relative">

          <p className="mt-4 text-4xl xl:text-5xl font-bold leading-tight">
            Chaque expérience est unique.
          </p>
        </div>

        <p className="relative text-sm text-gray-500">
          © {new Date().getFullYear()} Connecteo
        </p>
      </aside>

      <main className="flex flex-col items-center justify-center px-5 py-10 sm:px-8 bg-gray-50 lg:bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Logo className="h-12 w-auto" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8 lg:border-0 lg:shadow-none lg:p-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
