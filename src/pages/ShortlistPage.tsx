import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, X, Trash2, ListChecks, ExternalLink } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useListStore, useToastStore } from "@/store";
import { formatFollowers, formatEngagementRate } from "@/utils/formatters";

export function ShortlistPage() {
  const navigate = useNavigate();
  const selectedProfiles = useListStore((s) => s.selectedProfiles);
  const removeProfile = useListStore((s) => s.removeProfile);
  const clearProfiles = useListStore((s) => s.clearProfiles);
  const showToast = useToastStore((s) => s.showToast);

  const handleRemove = (userId: string, name: string) => {
    removeProfile(userId);
    showToast(`${name} removed from shortlist`, "info");
  };

  const handleClearAll = () => {
    clearProfiles();
    showToast("Shortlist cleared", "info");
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
              Shortlist
              {selectedProfiles.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                  {selectedProfiles.length}
                </span>
              )}
            </h1>
          </div>

          {selectedProfiles.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Clear all shortlisted profiles"
            >
              <Trash2 size={13} />
              Clear all
            </button>
          )}
        </div>

        {/* Empty state */}
        {selectedProfiles.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl">
            <EmptyState
              icon={<ListChecks size={24} className="text-indigo-400" />}
              title="Your shortlist is empty"
              description="Browse creators and hit Add to build your list."
            />
            <div className="pb-8 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Discover creators
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <ul className="divide-y divide-gray-100" role="list">
              {selectedProfiles.map(({ profile, platform, addedAt }) => {
                const identifier = profile.username || profile.handle;
                const displayHandle = identifier ? `@${identifier}` : profile.fullname;
                const addedDate = new Date(addedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <li
                    key={profile.user_id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <Avatar src={profile.picture} alt={profile.fullname} size="md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-semibold text-gray-900 truncate">
                          {profile.fullname}
                        </span>
                        <VerifiedBadge verified={profile.is_verified} />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-500 text-xs">{displayHandle}</span>
                        <PlatformBadge platform={platform} />
                      </div>
                    </div>

                    {/* Stats — hidden on small screens */}
                    <div className="hidden sm:flex items-center gap-6 flex-shrink-0 text-right">
                      <div>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5 justify-end">
                          <Users size={10} />
                          <span>Followers</span>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {formatFollowers(profile.followers)}
                        </div>
                      </div>
                      {profile.engagement_rate !== undefined && (
                        <div>
                          <div className="text-gray-400 text-xs mb-0.5">Eng. Rate</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatEngagementRate(profile.engagement_rate)}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-gray-400 text-xs mb-0.5">Added</div>
                        <div className="text-sm text-gray-600">{addedDate}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      {identifier && (
                        <Link
                          to={`/profile/${identifier}?platform=${platform}`}
                          aria-label={`View ${profile.fullname}'s profile`}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          <ExternalLink size={13} />
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemove(profile.user_id, profile.fullname)}
                        aria-label={`Remove ${profile.fullname} from shortlist`}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
