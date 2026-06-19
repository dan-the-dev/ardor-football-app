"use client";

import { ALL_CATEGORIES, formatCategoriaLabel } from "@/lib/exercises";

type CategoryChipFilterProps = {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
};

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-ardor-orange bg-ardor-orange text-white"
          : "border-ardor-gray bg-transparent text-gray-300 hover:border-ardor-orange hover:text-white",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export function CategoryChipFilter({ categories, value, onChange }: CategoryChipFilterProps) {
  return (
    <div className="-mx-4 mb-6 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max flex-nowrap gap-2 sm:w-auto sm:flex-wrap">
        <Chip
          label="Tutti"
          active={value === ALL_CATEGORIES}
          onClick={() => onChange(ALL_CATEGORIES)}
        />
        {categories.map((categoria) => (
          <Chip
            key={categoria}
            label={formatCategoriaLabel(categoria)}
            active={value === categoria}
            onClick={() => onChange(categoria)}
          />
        ))}
      </div>
    </div>
  );
}
