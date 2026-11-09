import type { ReactNode } from "react";
import Logo from "@/app/admin/components/Logo";

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 px-5 py-10 sm:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo className="h-14 w-auto" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
          {children}
        </div>
      </div>
    </main>
  );
}
