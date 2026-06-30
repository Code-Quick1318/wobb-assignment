import { clsx } from "clsx";
import { PLATFORM_COLORS, PLATFORM_LABELS } from "@/constants/platforms";
import type { Platform } from "@/types";

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "md";
}

export function PlatformBadge({ platform, size = "sm" }: PlatformBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center border font-medium rounded",
        PLATFORM_COLORS[platform],
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs rounded-md"
      )}
    >
      {PLATFORM_LABELS[platform]}
    </span>
  );
}
