"use client";

import { useEffect, useState } from "react";
import { Menu, PanelLeftClose } from "lucide-react";
import { usePathname } from "next/navigation";
import ArdorLogo from "@/components/ArdorLogo";
import Sidebar from "@/components/Sidebar";
import type { Season } from "@/lib/types";

export default function DashboardShell({
  children,
  seasons,
  userEmail,
  hasTacticsAccess,
}: {
  children: React.ReactNode;
  seasons: Season[];
  userEmail: string;
  hasTacticsAccess: boolean;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setSidebarOpen(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen && window.innerWidth < 1024 ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ardor-gray bg-ardor-black-soft px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-300 transition hover:bg-ardor-gray hover:text-white"
          aria-label="Apri menu"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <ArdorLogo size={32} />
          <span className="text-base font-semibold tracking-tight">
            Ardor <span className="text-ardor-orange">Hub</span>
          </span>
        </div>
        <div className="w-10" aria-hidden />
      </header>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Chiudi menu"
        />
      )}

      {!sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-30 hidden h-10 w-10 items-center justify-center rounded-xl border border-ardor-gray bg-ardor-black-soft text-gray-300 transition hover:bg-ardor-gray hover:text-white lg:flex"
          aria-label="Apri menu"
        >
          <Menu size={20} />
        </button>
      )}

      <Sidebar
        seasons={seasons}
        userEmail={userEmail}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        hasTacticsAccess={hasTacticsAccess}
      />

      <main
        className={`flex-1 p-4 transition-[margin] sm:p-6 lg:p-8 ${sidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}
      >
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
