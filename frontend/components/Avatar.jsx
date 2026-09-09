import Image from "next/image";
import { getAssetUrl } from "@/utils/api";

// Shared avatar renderer: shows the uploaded profile image if present,
// otherwise falls back to initials on a colored circle so every place that
// renders a user (Navbar, ProfileMenu, BlogCard, user tables) looks the same.
export default function Avatar({ src, name = "?", size = 40, className = "" }) {
  const url = getAssetUrl(src);
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (url) {
    return (
      <Image
        src={url}
        alt={name}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-blue-600 font-semibold text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials || "?"}
    </div>
  );
}
