/**
 * Development-only data consistency check.
 * Logs warnings for any creator in search data that has no matching profile JSON.
 * Run once at app startup — no-ops in production.
 */
import { extractProfiles } from "./dataHelpers";
import type { Platform } from "@/types";

const profileModules = import.meta.glob("../assets/data/profiles/*.json");

export function validateDataConsistency(): void {
  if (import.meta.env.PROD) return;

  const platforms: Platform[] = ["instagram", "youtube", "tiktok"];
  const availableFiles = new Set(
    Object.keys(profileModules).map((path) => {
      const match = path.match(/\/([^/]+)\.json$/);
      return match ? match[1] : "";
    })
  );

  const issues: string[] = [];

  for (const platform of platforms) {
    const profiles = extractProfiles(platform);
    for (const profile of profiles) {
      const identifier = profile.username || profile.handle;
      if (!identifier) {
        issues.push(`[${platform}] "${profile.fullname}" has no username or handle — cannot navigate to profile`);
        continue;
      }
      if (!availableFiles.has(identifier)) {
        issues.push(`[${platform}] "${profile.fullname}" (@${identifier}) has no profile JSON — will show "Profile not found"`);
      }
    }
  }

  if (issues.length > 0) {
    console.group("⚠️ Data consistency issues");
    issues.forEach((issue) => console.warn(issue));
    console.groupEnd();
  } else {
    console.log("✅ All search creators have matching profile JSON files");
  }
}
