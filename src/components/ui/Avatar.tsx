import { useState } from "react";
import { clsx } from "clsx";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-9 h-9 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-20 h-20 text-xl",
};

/** Generates a consistent background color from a name string */
function getAvatarColor(name: string): string {
  const colors = [
    "bg-indigo-500", "bg-violet-500", "bg-pink-500", "bg-rose-500",
    "bg-orange-500", "bg-amber-500", "bg-emerald-500", "bg-teal-500",
    "bg-cyan-500", "bg-sky-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

/** Gets initials — first letter of first and last word */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Avatar with automatic fallback to initials when the image URL fails to load.
 * Handles expired CDN URLs, broken links, and missing images gracefully.
 */
export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  const base = clsx(
    "rounded-full object-cover flex-shrink-0 border border-gray-100",
    sizeClasses[size],
    className
  );

  if (failed || !src) {
    return (
      <div
        className={clsx(
          base,
          "flex items-center justify-center font-semibold text-white border-0",
          getAvatarColor(alt)
        )}
        aria-label={alt}
        role="img"
      >
        {getInitials(alt)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={base}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
