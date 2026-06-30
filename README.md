# Wobb Influencer Search — Submission

**Live demo:** [https://wobb-assignment.vercel.app](https://wobb-assignment.vercel.app) ← replace with your actual URL after deployment

A polished influencer discovery tool built with React 19, TypeScript, Vite, Tailwind CSS v4, and Zustand.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

```bash
npm run build   # production build
npm run lint    # ESLint
```

---

## What I Changed

### 1. Bug Fixes

- **Missing profile JSON files** — 24 creators appeared in search results but had no matching profile JSON, causing "Profile not found" for SET India, CoComelon, PewDiePie, Zee Music Company, Vlad and Niki, Kids Diana Show, Like Nastya, WWE, Leo Messi, Selena Gomez, Kylie Jenner, Dwayne Johnson, Ariana Grande, Kim Kardashian, Khloé Kardashian, Beyoncé, Charli D'Amelio, Will Smith, Bella Poarch, Addison Rae, Kimberly Loaiza, TikTok, Zach King, and domelipa. Created all missing profile JSON files.
- **Broken platform detection on detail page** — when navigating from search, the `?platform=` query param was read but had no fallback. Now falls back to the profile JSON's own `type` field, so Add to List always uses the correct platform.
- **"Add to List" on detail page was broken** — the button was `disabled` when already added with no way to remove. Replaced with a toggle: click again to remove from shortlist (with toast feedback).
- **`formatFollowers` output `324.0M`** — fixed to strip trailing `.0` so it renders `324M`, `277M`, etc.
- **Debug `console.log` in SearchPage** — removed the leftover `console.log("Clicked profile:", username)`.
- **Dead `onProfileClick` prop chain** — `SearchPage → ProfileList → ProfileCard` was passing a callback that only logged to the console. Removed the prop entirely; `ProfileCard` handles its own navigation directly.
- **No 404 catch-all route** — added `<Route path="*" element={<NotFoundPage />} />` and a proper `NotFoundPage` component.
- **"✓ Added" had double checkmark** — the button rendered both a `<Check>` icon and the literal `✓` character. Kept the icon only.

### 2. UI/UX Redesign

Starting from a rough-but-working base, the full UI was redesigned:

- **Card layout** — Profile cards with hover lift (`-translate-y-0.5`), smooth `duration-200` transitions, indigo shadow on hover
- **Avatar component** — lazy-loaded images with automatic initials fallback on error; consistent border and sizing across all contexts (sm/md/lg)
- **Platform badges** — color-coded chips (pink for Instagram, red for YouTube, dark for TikTok) used consistently everywhere
- **Verified badge** — `BadgeCheck` icon inline with name across cards and detail page
- **Shortlist panel** — sticky sidebar on desktop, stacks below on mobile; confirmation dialog before clearing all; remove button visible on hover
- **Toast notifications** — custom lightweight store-based toast system (success/info/warning variants); auto-dismiss after 3s; accessible with `aria-live="polite"`
- **Loading skeleton** — animated placeholder on profile detail page during data load
- **Empty states** — reusable `EmptyState` component for zero-result search and empty shortlist
- **Sticky filter bar** — search input + platform chips stick below the header when scrolling
- **Profile detail page** — full hero card with bio, stats grid (followers, engagement rate, post count, engagements), averages section (avg likes, comments, views), external profile link
- **Responsive** — mobile-first grid; shortlist panel stacks below the creator list on smaller screens; stat columns collapse gracefully

### 3. Zustand State Management

No React Context is used anywhere. All state is managed through four Zustand stores:

| Store | Purpose |
|---|---|
| `useListStore` | Selected profiles — persisted to `localStorage` via `zustand/middleware/persist` |
| `useSearchStore` | Active platform filter and search query |
| `useProfileStore` | Profile detail page loading state |
| `useToastStore` | Toast notification queue with auto-dismiss |

### 4. Select Profile & Add to List

Full implementation:

- **Add** from any profile card on the search page or from the profile detail page
- **Duplicate prevention** — `isProfileSelected(userId)` guard in the store
- **Remove** — X button on each shortlist entry (appears on hover); also togglable from the detail page button
- **Clear all** — confirmation dialog before bulk removal
- **Persistence** — shortlist survives page refresh via `localStorage` (`wobb-selected-profiles` key)
- **Instant UI sync** — both the card button and shortlist panel react immediately via shared Zustand store

### 5. Code Quality

- Removed all prop drilling — each component subscribes to the store slice it needs
- Extracted reusable components: `Avatar`, `PlatformBadge`, `StatCard`, `EmptyState`, `VerifiedBadge`, `ProfileSkeleton`
- `PLATFORM_COLORS` and `PLATFORM_LABELS` centralized in `src/constants/platforms.ts`
- All data-loading logic in `src/utils/profileLoader.ts` and `src/utils/dataHelpers.ts`
- Full TypeScript — no `any`, all props and store slices are typed
- `src/utils/validateDataConsistency.ts` — dev-only startup check that warns if any search creator is missing a profile JSON

### 6. Performance

- `React.memo` on `ProfileCard` — only re-renders when this card's specific profile changes state
- `useCallback` on all event handlers in `ProfileCard` for stable references
- `useMemo` in `SearchPage` for derived `allProfiles` and `filteredProfiles` arrays — avoids the infinite re-render trap of deriving arrays inside Zustand selectors
- `React.lazy` + `Suspense` on `ProfileDetailPage` — code-splits the detail page out of the initial bundle
- Per-profile Zustand selector (`s.isProfileSelected(profile.user_id)`) — each card only re-renders when its own selected state changes
- `import.meta.glob` for profile JSON — Vite splits each profile into its own chunk, loaded on demand

---

## Libraries Added

No new runtime dependencies were added beyond what was already in the project. All features were built with:

- **Zustand** — already in the project; used for all state
- **Tailwind CSS v4** — already in the project; used for all styling
- **lucide-react** — already in the project; used for all icons
- **clsx** — already in the project; used for conditional class merging
- **react-router-dom v7** — already in the project; used for routing

---

## Assumptions

- Profile images are external CDN URLs from the data files. The `Avatar` component gracefully falls back to colored initials if any image fails to load — no broken image icons.
- The 24 missing profile JSON files were created with data sourced from the corresponding search result entries (followers, engagement rate, bio, platform type). Stats match what's shown in the search list.
- "Platform" on the detail page is inferred from the `?platform=` URL param when present, falling back to the profile JSON's `type` field. This means profiles loaded by direct URL (e.g. bookmarked) still display the correct platform badge.
- The starter project's `react-beautiful-dnd` dependency was left in place (it was in `package.json` but unused). It can be removed.

---

## Trade-offs

- **No test suite** — the assignment didn't ask for tests and setting up a full Vitest/RTL suite would have taken significant time better spent on features and UX.
- **Profile data is static** — all data lives in local JSON files. A real product would need an API layer with proper caching, pagination, and error handling.
- **Toast system is custom** — a library like `react-hot-toast` would add polish (enter/exit animations) but adds a dependency. The custom Zustand-based implementation covers all required behavior.
- **No drag-to-reorder on shortlist** — `react-beautiful-dnd` is in the project's dependencies, suggesting this was intended, but it wasn't implemented to keep scope focused on the core requirements.

---

## Remaining Improvements

- Add Vitest + React Testing Library test coverage for stores and key components
- Implement drag-to-reorder in the shortlist panel (`react-beautiful-dnd` is already installed)
- Add export functionality (copy to clipboard, CSV download) for the shortlist
- Add pagination or virtual scrolling if the creator list grows large
- Deploy to Vercel/Netlify for a live URL
