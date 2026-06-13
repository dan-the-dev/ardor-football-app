import Image from "next/image";

export default function ArdorLogo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt="Ardor"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      priority
    />
  );
}
