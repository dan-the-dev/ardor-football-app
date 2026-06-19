import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import ExercisesCardGrid from "@/components/ExercisesCardGrid";
import type { Exercise } from "@/lib/types";

export default async function ExercisesPage() {
  const supabase = await createClient();

  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .order("nome", { ascending: true });

  const exerciseRows = (exercises ?? []) as Exercise[];

  return (
    <div>
      <PageHeader title="Esercizi" description="Catalogo esercizi di allenamento" />
      <ExercisesCardGrid exercises={exerciseRows} />
    </div>
  );
}
