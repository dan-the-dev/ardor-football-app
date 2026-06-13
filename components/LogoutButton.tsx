"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-400 transition hover:bg-ardor-gray hover:text-white"
    >
      <LogOut size={16} />
      Esci
    </button>
  );
}
