import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAccessibleSeasons } from "@/lib/season";
import Sidebar from "@/components/Sidebar";

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

  const seasons = await getAccessibleSeasons(supabase);

  return (
    <div className="flex min-h-screen">
      <Sidebar seasons={seasons} userEmail={user.email ?? ""} />
      <main className="ml-64 flex-1 p-6 md:p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
