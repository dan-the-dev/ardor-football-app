import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import type { FormationsByCategory } from "@/lib/types";

export default async function TacticsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const hasAccess = userData.user?.app_metadata?.global_tactics_access === true;

  if (!hasAccess) {
    return (
      <div>
        <PageHeader title="Tattiche" description="Moduli e schemi, su tutte le stagioni" />
        <Card>
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Lock className="text-ardor-orange" size={32} />
            <p className="text-lg font-semibold text-white">Sezione riservata</p>
            <p className="max-w-md text-sm text-gray-400">
              Non hai i permessi per visualizzare questa sezione. Contatta lo staff per richiedere
              l&apos;accesso alle tattiche globali.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const { data } = await supabase
    .from("formations_by_category")
    .select("*")
    .order("categoria", { ascending: true })
    .order("volte_usato", { ascending: false });

  const rows = (data ?? []) as FormationsByCategory[];

  const categories = Array.from(new Set(rows.map((r) => r.categoria)));

  return (
    <div>
      <PageHeader title="Tattiche" description="Moduli e schemi, su tutte le stagioni" />

      {categories.length > 0 ? (
        <div className="space-y-6">
          {categories.map((cat) => (
            <Card key={cat}>
              <CardTitle>{cat}</CardTitle>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-ardor-gray text-xs uppercase text-gray-500">
                      <th className="px-3 py-2">Modulo</th>
                      <th className="px-3 py-2 text-right">Volte usato</th>
                      <th className="px-3 py-2 text-right">V</th>
                      <th className="px-3 py-2 text-right">N</th>
                      <th className="px-3 py-2 text-right">P</th>
                      <th className="px-3 py-2 text-right">Gol fatti</th>
                      <th className="px-3 py-2 text-right">Gol subiti</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows
                      .filter((r) => r.categoria === cat)
                      .map((r) => (
                        <tr key={`${r.categoria}-${r.modulo}`} className="border-b border-ardor-gray/50 last:border-0">
                          <td className="px-3 py-2 font-medium text-white">{r.modulo}</td>
                          <td className="px-3 py-2 text-right text-gray-300">{r.volte_usato}</td>
                          <td className="px-3 py-2 text-right text-gray-300">{r.vittorie}</td>
                          <td className="px-3 py-2 text-right text-gray-300">{r.pareggi}</td>
                          <td className="px-3 py-2 text-right text-gray-300">{r.sconfitte}</td>
                          <td className="px-3 py-2 text-right text-gray-300">{r.gol_fatti}</td>
                          <td className="px-3 py-2 text-right text-gray-300">{r.gol_subiti}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-gray-500">Nessun dato disponibile dalla vista formations_by_category.</p>
        </Card>
      )}
    </div>
  );
}
