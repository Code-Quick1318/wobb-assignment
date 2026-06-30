import { useState } from "react";
import { Link } from "react-router-dom";
import { Users, X, ListChecks, Trash2, ArrowRight } from "lucide-react";
import { useListStore, useToastStore } from "@/store";
import { VerifiedBadge } from "./VerifiedBadge";
import { PlatformBadge, EmptyState, Avatar } from "./ui";
import { formatFollowers } from "@/utils/formatters";

// ─── Clear-all confirmation dialog ───────────────────────────────────────────

interface ClearConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ClearConfirmDialog({ onConfirm, onCancel }: ClearConfirmProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-dialog-title"
      className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 z-10 p-6 text-center"
    >
      <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
        <Trash2 size={18} className="text-red-500" />
      </div>
      <div>
        <p id="clear-dialog-title" className="font-semibold text-gray-900 text-sm mb-1">
          Clear all profiles?
        </p>
        <p className="text-gray-500 text-xs">This will remove all shortlisted profiles.</p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-1.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export function SelectedProfilesPanel() {
  const selectedProfiles = useListStore((s) => s.selectedProfiles);
  const removeProfile = useListStore((s) => s.removeProfile);
  const clearProfiles = useListStore((s) => s.clearProfiles);
  const showToast = useToastStore((s) => s.showToast);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleRemove = (userId: string, name: string) => {
    removeProfile(userId);
    showToast(`${name} removed from list`, "info");
  };

  const handleClearConfirmed = () => {
    clearProfiles();
    setShowClearConfirm(false);
    showToast("List cleared", "info");
  };

  return (
    <aside
      aria-label="Selected profiles"
      className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden"
    >
      {showClearConfirm && (
        <ClearConfirmDialog
          onConfirm={handleClearConfirmed}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">Shortlist</h2>
          {selectedProfiles.length > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
              {selectedProfiles.length}
            </span>
          )}
        </div>

        {selectedProfiles.length > 0 && (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            aria-label="Clear all shortlisted profiles"
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={12} />
            Clear all
          </button>
        )}
      </div>

      {/* Body */}
      {selectedProfiles.length === 0 ? (
        <EmptyState
          icon={<ListChecks size={22} className="text-indigo-400" />}
          title="No creators shortlisted"
          description='Hit the Add button on any creator card to start building your list.'
        />
      ) : (
        <>
          <ul className="divide-y divide-gray-50" role="list">
            {selectedProfiles.map(({ profile, platform }) => {
              const identifier = profile.username || profile.handle;
              const displayHandle = identifier ? `@${identifier}` : profile.fullname;

              return (
                <li
                  key={profile.user_id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <Avatar src={profile.picture} alt={profile.fullname} size="sm" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {profile.fullname}
                      </span>
                      <VerifiedBadge verified={profile.is_verified} />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-gray-400 text-xs truncate">{displayHandle}</span>
                      <PlatformBadge platform={platform} />
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-gray-400 text-xs">
                      <Users size={10} />
                      <span>{formatFollowers(profile.followers)}</span>
                    </div>
                  </div>

                  {/* Actions — reveal on hover/focus */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    {identifier && (
                      <Link
                        to={`/profile/${identifier}?platform=${platform}`}
                        aria-label={`View ${profile.fullname}'s profile`}
                        className="w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
                      >
                        <ArrowRight size={12} />
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(profile.user_id, profile.fullname)}
                      aria-label={`Remove ${profile.fullname} from shortlist`}
                      className="w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Footer — link to full shortlist page */}
          <div className="border-t border-gray-100 px-4 py-2.5">
            <Link
              to="/shortlist"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              View full shortlist →
            </Link>
          </div>
        </>
      )}
    </aside>
  );
}
