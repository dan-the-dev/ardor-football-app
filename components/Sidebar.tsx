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
} from "lucide-react";
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
  { href: "/tactics", label: "Tattiche", icon: LayoutGrid },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({
  seasons,
  userEmail,
}: {
  seasons: Season[];
  userEmail: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-ardor-gray bg-ardor-black-soft">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ardor-orange/10 text-ardor-orange">
          <GoalIcon size={20} />
        </span>
        <span className="text-lg font-semibold tracking-tight">
          Ardor <span className="text-ardor-orange">Hub</span>
        </span>
      </div>

      <div className="px-4 pb-4">
        <SeasonSelector seasons={seasons} />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
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
