import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import type { Season } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: seasons } = await supabase
    .from("seasons")
    .select("*")
    .order("code", { ascending: false });

  return (
    <div className="flex min-h-screen">
      <Sidebar seasons={(seasons ?? []) as Season[]} userEmail={user.email ?? ""} />
      <main className="ml-64 flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
