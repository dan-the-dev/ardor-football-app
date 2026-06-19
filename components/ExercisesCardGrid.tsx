"use client";

import Link from "next/link";
import { useState } from "react";
import { ExerciseVideoPreview } from "@/components/ExerciseVideoPreview";
import CategoryBadge from "@/components/CategoryBadge";
import { CategoryChipFilter } from "@/components/ui/CategoryChipFilter";
import { ALL_CATEGORIES, formatCategoriaLabel } from "@/lib/exercises";
import { truncateText } from "@/lib/format";
import { extractYouTubeVideoId } from "@/lib/youtube";
import type { Exercise } from "@/lib/types";

function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const categoriaLabel = formatCategoriaLabel(exercise.categoria);
  const hasVideo = Boolean(extractYouTubeVideoId(exercise.video_url));
  const description = truncateText(exercise.descrizione);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-ardor-gray bg-ardor-black-soft">
      <div className="aspect-video w-full overflow-hidden bg-ardor-black">
        {hasVideo ? (
          <ExerciseVideoPreview videoUrl={exercise.video_url} />
        ) : (
          <div className="flex h-full items-center justify-center px-4">
            <span className="text-sm font-medium text-gray-500">{categoriaLabel}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-semibold text-white">{exercise.nome}</h3>

        <div className="mt-2">
          <CategoryBadge categoria={exercise.categoria} />
        </div>

        {description && <p className="mt-3 text-sm text-gray-400">{description}</p>}

        <div className="mt-4 pt-2">
          <Link
            href={`/exercises/${exercise.slug}`}
            className="text-sm font-medium text-ardor-orange hover:text-white"
          >
            Vedi esercizio
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ExercisesCardGrid({ exercises }: { exercises: Exercise[] }) {
  const [filter, setFilter] = useState<string>(ALL_CATEGORIES);

  const categories = Array.from(new Set(exercises.map((e) => e.categoria))).sort();
  const filtered =
    filter === ALL_CATEGORIES ? exercises : exercises.filter((e) => e.categoria === filter);

  return (
    <div>
      <CategoryChipFilter categories={categories} value={filter} onChange={setFilter} />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => (
            <ExerciseCard key={ex.slug} exercise={ex} />
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-gray-500">Nessun esercizio trovato.</p>
      )}
    </div>
  );
}
