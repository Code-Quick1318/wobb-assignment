import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Platform, SelectedProfile, UserProfileSummary } from "@/types";

// ─── State & Actions ──────────────────────────────────────────────────────────

interface ListState {
  selectedProfiles: SelectedProfile[];
}

interface ListActions {
  addProfile: (profile: UserProfileSummary, platform: Platform) => void;
  removeProfile: (userId: string) => void;
  isProfileSelected: (userId: string) => boolean;
  clearProfiles: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────
// persist() wraps the store and automatically syncs state to localStorage.
// On load, Zustand rehydrates selectedProfiles before the first render —
// no useEffect, no manual initialization, no risk of a hydration flash.

export const useListStore = create<ListState & ListActions>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],

      addProfile: (profile, platform) => {
        // Guard: never add a duplicate. userId is the stable unique key.
        if (get().isProfileSelected(profile.user_id)) return;

        set((state) => ({
          selectedProfiles: [
            ...state.selectedProfiles,
            { profile, platform, addedAt: new Date().toISOString() },
          ],
        }));
      },

      removeProfile: (userId) => {
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (item) => item.profile.user_id !== userId
          ),
        }));
      },

      // Reads current state via get() — no re-render triggered, safe to call
      // inside event handlers and other actions without subscribing to the store.
      isProfileSelected: (userId) => {
        return get().selectedProfiles.some((item) => item.profile.user_id === userId);
      },

      clearProfiles: () => set({ selectedProfiles: [] }),
    }),
    {
      name: "wobb-selected-profiles", // localStorage key
      version: 1, // bump this to invalidate stale persisted data
      storage: createJSONStorage(() => localStorage),
      // Only persist the data array — actions are recreated on every load
      partialize: (state) => ({ selectedProfiles: state.selectedProfiles }),
    }
  )
);
