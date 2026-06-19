import { formatCategoriaLabel, getCategoryBadgeClasses } from "@/lib/exercises";

export default function CategoryBadge({ categoria }: { categoria: string }) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold ${getCategoryBadgeClasses(categoria)}`}
    >
      {formatCategoriaLabel(categoria)}
    </span>
  );
}
