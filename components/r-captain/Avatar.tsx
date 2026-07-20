import Image from "next/image";

interface AvatarProps {
  size?: number;
  className?: string;
}

export default function Avatar({
  size = 180,
  className = "",
}: AvatarProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src="/images/r-captain/avatar.png"
        alt="R-CAPTAIN - ROOTYM AI Export Intelligence Partner"
        width={size}
        height={size}
        className="object-cover"
        priority
      />
    </div>
  );
}