import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ExerciseVideoEmbed } from "@/components/ExerciseVideoEmbed";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { CATEGORY_LABELS } from "@/lib/exercises";
import { createClient } from "@/lib/supabase/server";
import type { Exercise } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("exercises").select("nome").eq("slug", slug).maybeSingle();

  if (!data) {
    return { title: "Esercizio non trovato" };
  }

  return { title: data.nome };
}

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("exercises").select("*").eq("slug", slug).maybeSingle();

  if (!data) {
    notFound();
  }

  const exercise = data as Exercise;

  return (
    <div>
      <Link
        href="/exercises"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-ardor-orange"
      >
        <ArrowLeft size={16} /> Torna agli esercizi
      </Link>

      <PageHeader title={exercise.nome} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-400">Categoria</dt>
              <dd className="mt-0.5 font-medium text-white">
                {CATEGORY_LABELS[exercise.categoria] ?? exercise.categoria}
              </dd>
            </div>

            {exercise.descrizione && (
              <div>
                <dt className="text-gray-400">Descrizione</dt>
                <dd className="mt-0.5 text-gray-300">{exercise.descrizione}</dd>
              </div>
            )}

            {exercise.score_medio != null && exercise.score_medio > 0 && (
              <div>
                <dt className="text-gray-400">Score medio</dt>
                <dd className="mt-0.5 font-medium text-white">{exercise.score_medio.toFixed(1)}</dd>
              </div>
            )}

            {exercise.volte_usato > 0 && (
              <div>
                <dt className="text-gray-400">Volte usato</dt>
                <dd className="mt-0.5 font-medium text-white">{exercise.volte_usato}</dd>
              </div>
            )}
          </dl>
        </Card>

        {exercise.video_url && (
          <div className="lg:col-span-1">
            <ExerciseVideoEmbed videoUrl={exercise.video_url} />
          </div>
        )}
      </div>
    </div>
  );
}
