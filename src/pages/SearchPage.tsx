import { useMemo } from "react";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { SelectedProfilesPanel } from "@/components/SelectedProfilesPanel";
import { useSearchStore } from "@/store";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";

export function SearchPage() {
  // Subscribe to primitive values only — these are stable scalars,
  // so Zustand's default equality check (===) works correctly and
  // never causes spurious re-renders.
  const platform = useSearchStore((s) => s.platform);
  const searchQuery = useSearchStore((s) => s.searchQuery);
  const switchPlatform = useSearchStore((s) => s.switchPlatform);
  const setSearchQuery = useSearchStore((s) => s.setSearchQuery);

  // Derive arrays inside useMemo — NOT inside a Zustand selector.
  // Zustand selectors run on every store update and return new array
  // references each time, which triggers infinite re-render loops.
  // useMemo only recomputes when platform or searchQuery actually changes.
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);

  const filteredProfiles = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-1">
          Discover Creators
        </h1>
        <p className="text-gray-500 text-sm">
          Browse and shortlist top influencers across platforms.
        </p>
      </div>

      <div className="sticky top-14 z-40 bg-gray-50 pt-2 pb-3 -mx-4 sm:-mx-6 px-4 sm:px-6 border-b border-gray-100 mb-6">
        <PlatformFilter
          selected={platform}
          onChange={switchPlatform}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {searchQuery ? (
                <>
                  <span className="font-medium text-gray-900">{filteredProfiles.length}</span>
                  {" "}of {allProfiles.length} results
                </>
              ) : (
                <>
                  <span className="font-medium text-gray-900">{allProfiles.length}</span>
                  {" "}creators
                </>
              )}
            </p>
          </div>

          <ProfileList
            profiles={filteredProfiles}
            platform={platform}
          />
        </div>

        <div className="w-full lg:w-80 lg:sticky lg:top-36 flex-shrink-0">
          <SelectedProfilesPanel />
        </div>
      </div>
    </Layout>
  );
}
