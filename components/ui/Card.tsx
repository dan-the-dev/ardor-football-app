import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-ardor-gray bg-ardor-black-soft p-4 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </h3>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </Card>
  );
}
