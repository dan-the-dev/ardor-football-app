import { ROLE_BADGE_CLASSES, ROLE_LABELS } from "@/lib/roles";
import type { Ruolo } from "@/lib/types";

export default function RoleBadge({ ruolo }: { ruolo: Ruolo | null }) {
  if (!ruolo) {
    return <span className="text-gray-500">—</span>;
  }

  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold ${ROLE_BADGE_CLASSES[ruolo]}`}
    >
      {ROLE_LABELS[ruolo]}
    </span>
  );
}
