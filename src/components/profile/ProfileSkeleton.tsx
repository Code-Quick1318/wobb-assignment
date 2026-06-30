/**
 * Loading skeleton for the profile detail page.
 * Extracted from ProfileDetailPage where it was a private inline component,
 * making it independently testable and reusable.
 */
export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-label="Loading profile...">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-5 bg-gray-200 rounded w-40" />
            <div className="h-4 bg-gray-200 rounded w-28" />
            <div className="h-3 bg-gray-200 rounded w-20 mt-2" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
