import { create } from "zustand";
import type { Platform } from "@/types";

interface SearchState {
  platform: Platform;
  searchQuery: string;
}

interface SearchActions {
  setPlatform: (platform: Platform) => void;
  setSearchQuery: (query: string) => void;
  /** Switch platform and clear query atomically — prevents stale query flash */
  switchPlatform: (platform: Platform) => void;
}

export const useSearchStore = create<SearchState & SearchActions>((set) => ({
  platform: "instagram",
  searchQuery: "",

  setPlatform: (platform) => set({ platform }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  switchPlatform: (platform) => set({ platform, searchQuery: "" }),
}));
