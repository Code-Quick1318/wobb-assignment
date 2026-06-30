import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, Plus, Check } from "lucide-react";
import { clsx } from "clsx";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { PlatformBadge, Avatar } from "./ui";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";
import { useListStore, useToastStore } from "@/store";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

// memo() prevents re-renders when parent (ProfileList) re-renders but this
// card's specific profile/platform props haven't changed. Since profile objects
// come from static JSON (stable references), the equality check is O(1).
export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
}: ProfileCardProps) {
  const navigate = useNavigate();

  // Subscribe only to whether THIS specific profile is selected.
  // This component will not re-render when a different profile is added/removed.
  const isSelected = useListStore((s) => s.isProfileSelected(profile.user_id));
  const addProfile = useListStore((s) => s.addProfile);
  const showToast = useToastStore((s) => s.showToast);

  const identifier = profile.username || profile.handle;
  const displayHandle = identifier ? `@${identifier}` : profile.fullname;
  const isClickable = !!identifier;

  // useCallback keeps the handler reference stable across re-renders so memo
  // on child components (if added later) can still bail out correctly.
  const handleClick = useCallback(() => {
    if (!isClickable) return;
    navigate(`/profile/${identifier}?platform=${platform}`);
  }, [isClickable, identifier, navigate, platform]);

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) return;
    addProfile(profile, platform);
    showToast(`${profile.fullname} added to shortlist`);
  }, [isSelected, addProfile, profile, platform, showToast]);

  return (
    <div
      onClick={handleClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      aria-label={isClickable ? `View ${profile.fullname}'s profile` : undefined}
      className={clsx(
        "group bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 transition-all duration-200",
        isClickable
          ? "cursor-pointer hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50 hover:-translate-y-0.5"
          : "opacity-50 cursor-default"
      )}
    >
      {/* Avatar */}
      <Avatar
        src={profile.picture}
        alt={profile.fullname}
        size="md"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-semibold text-gray-900 text-sm truncate">
            {profile.fullname}
          </span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-500 text-xs truncate">{displayHandle}</span>
          <PlatformBadge platform={platform} />
        </div>
        {/* Mobile-only follower count */}
        <div className="flex items-center gap-1 mt-1 sm:hidden text-gray-500 text-xs">
          <Users size={10} />
          <span>{formatFollowers(profile.followers)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-5 flex-shrink-0 text-right">
        <div>
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5 justify-end">
            <Users size={11} />
            <span>Followers</span>
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {formatFollowers(profile.followers)}
          </div>
        </div>
        {profile.engagement_rate !== undefined && (
          <div>
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5 justify-end">
              <TrendingUp size={11} />
              <span>Eng. Rate</span>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {formatEngagementRate(profile.engagement_rate)}
            </div>
          </div>
        )}
      </div>

      {/* CTA — Add / Added */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={isSelected}
        aria-label={isSelected ? `${profile.fullname} already in shortlist` : `Add ${profile.fullname} to shortlist`}
        aria-pressed={isSelected}
        className={clsx(
          "flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ml-2",
          isSelected
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default"
            : "border-dashed border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
        )}
      >
        {isSelected ? <><Check size={12} />Added</> : <><Plus size={12} />Add</>}
      </button>
    </div>
  );
});
