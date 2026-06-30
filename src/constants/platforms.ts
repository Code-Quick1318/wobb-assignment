import type { Platform } from "@/types";

/**
 * Single source of truth for all platform-related display data.
 * Previously duplicated in ProfileCard.tsx and SelectedProfilesPanel.tsx.
 * Any platform UI change now requires editing exactly one file.
 */

export const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "bg-pink-50 text-pink-700 border-pink-200",
  youtube: "bg-red-50 text-red-700 border-red-200",
  tiktok: "bg-gray-900 text-gray-100 border-gray-700",
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
};

/**
 * Fallback badge style for unknown/dynamic platform strings
 * (used on ProfileDetailPage where platform comes from a URL param).
 */
export const PLATFORM_BADGE_FALLBACK = "bg-gray-100 text-gray-600 border-gray-200";
