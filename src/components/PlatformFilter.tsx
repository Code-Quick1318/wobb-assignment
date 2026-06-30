import { useRef } from "react";
import { Search, X, Camera, Play, Music } from "lucide-react";
import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: <Camera size={14} />,
  youtube: <Play size={14} />,
  tiktok: <Music size={14} />,
};

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or username..."
          aria-label="Search influencers"
          className="w-full h-10 pl-10 pr-10 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     transition-shadow"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              onSearchChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Platform filter chips */}
      <div className="flex gap-2" role="tablist" aria-label="Filter by platform">
        {PLATFORMS.map((p) => {
          const isSelected = selected === p;
          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onChange(p)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all
                ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-900"
                }`}
            >
              {platformIcons[p]}
              {getPlatformLabel(p)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
