import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAccessibleSeasons } from "@/lib/season";
import { hasGlobalTacticsAccess } from "@/lib/tactics-access";
import DashboardShell from "@/components/DashboardShell";

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

  const [seasons, hasTacticsAccess] = await Promise.all([
    getAccessibleSeasons(supabase),
    hasGlobalTacticsAccess(supabase),
  ]);

  return (
    <DashboardShell
      seasons={seasons}
      userEmail={user.email ?? ""}
      hasTacticsAccess={hasTacticsAccess}
    >
      {children}
    </DashboardShell>
  );
}
