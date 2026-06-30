import { SearchX } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { EmptyState } from "./ui";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export function ProfileList({ profiles, platform }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="py-10">
        <EmptyState
          icon={<SearchX size={22} className="text-gray-400" aria-hidden="true" />}
          title="No creators found"
          description="Try a different name, username, or switch platforms."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
        />
      ))}
    </div>
  );
}
