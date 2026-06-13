"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Activity,
  Goal as GoalIcon,
  BarChart3,
  Repeat,
  LayoutGrid,
  PanelLeftClose,
} from "lucide-react";
import ArdorLogo from "@/components/ArdorLogo";
import SeasonSelector from "@/components/SeasonSelector";
import LogoutButton from "@/components/LogoutButton";
import type { Season } from "@/lib/types";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/players", label: "Rosa", icon: Users },
  { href: "/sessions", label: "Allenamenti", icon: Activity },
  { href: "/matches", label: "Partite", icon: GoalIcon },
  { href: "/stats", label: "Statistiche", icon: BarChart3 },
  { href: "/exercises", label: "Esercizi", icon: Repeat },
  { href: "/tactics", label: "Tattiche", icon: LayoutGrid, tacticsOnly: true },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({
  seasons,
  userEmail,
  isOpen,
  onClose,
  hasTacticsAccess,
}: {
  seasons: Season[];
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
  hasTacticsAccess: boolean;
}) {
  const pathname = usePathname();

  const navItems = NAV_ITEMS.filter((item) => !("tacticsOnly" in item && item.tacticsOnly) || hasTacticsAccess);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex w-64 max-w-[85vw] flex-col border-r border-ardor-gray bg-ardor-black-soft transition-transform duration-200 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <ArdorLogo size={36} />
          <span className="truncate text-lg font-semibold tracking-tight">
            Ardor <span className="text-ardor-orange">Hub</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:bg-ardor-gray hover:text-white"
          aria-label="Chiudi menu"
        >
          <PanelLeftClose size={20} />
        </button>
      </div>

      <div className="px-4 pb-4">
        <SeasonSelector seasons={seasons} />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-ardor-orange/10 text-ardor-orange"
                  : "text-gray-400 hover:bg-ardor-gray hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ardor-gray px-4 py-4">
        <p className="mb-2 truncate text-xs text-gray-500">{userEmail}</p>
        <LogoutButton />
      </div>
    </aside>
  );
}
