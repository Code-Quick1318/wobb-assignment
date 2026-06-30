import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";
import { PLATFORM_LABELS } from "@/constants/platforms";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => item.account.user_profile);
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query) return profiles;
  const q = query.toLowerCase();
  return profiles.filter((p) => {
    const handle = (p.username ?? p.handle ?? "").toLowerCase();
    return handle.includes(q) || p.fullname.toLowerCase().includes(q);
  });
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

/** Re-export from constants — single source of truth */
export function getPlatformLabel(platform: Platform): string {
  return PLATFORM_LABELS[platform];
}
