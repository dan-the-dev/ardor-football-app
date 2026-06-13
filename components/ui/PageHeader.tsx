export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4 sm:mb-6">
      <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h1>
      {description && <p className="mt-1 text-sm text-gray-400">{description}</p>}
    </div>
  );
}
