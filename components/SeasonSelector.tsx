"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { Season } from "@/lib/types";

export default function SeasonSelector({ seasons }: { seasons: Season[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get("season") ?? seasons[0]?.code ?? "";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("season", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  if (seasons.length === 0) {
    return (
      <div className="rounded-xl border border-ardor-gray bg-ardor-black px-3 py-2 text-xs text-gray-500">
        Nessuna stagione disponibile
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={current}
        onChange={handleChange}
        className="w-full appearance-none rounded-xl border border-ardor-gray bg-ardor-black px-3 py-2 pr-8 text-sm text-white outline-none transition focus:border-ardor-orange"
      >
        {seasons.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500"
      />
    </div>
  );
}
