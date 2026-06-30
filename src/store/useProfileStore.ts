import { create } from "zustand";
import type { FullUserProfile } from "@/types";
import { loadProfileByUsername } from "@/utils/profileLoader";

interface ProfileState {
  profile: FullUserProfile | null;
  isLoading: boolean;
  error: string | null;
}

interface ProfileActions {
  loadProfile: (username: string) => Promise<void>;
  reset: () => void;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const useProfileStore = create<ProfileState & ProfileActions>((set) => ({
  ...initialState,

  loadProfile: async (username) => {
    set({ isLoading: true, error: null, profile: null });

    const response = await loadProfileByUsername(username);

    if (!response) {
      set({ isLoading: false, error: "Profile not found" });
      return;
    }

    set({ isLoading: false, profile: response.data.user_profile, error: null });
  },

  reset: () => set(initialState),
}));
