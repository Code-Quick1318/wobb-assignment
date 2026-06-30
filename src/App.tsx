import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";
import { ShortlistPage } from "@/pages/ShortlistPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Code-split the detail page — only needed on /profile/:username.
// Keeps the initial bundle lean; the skeleton inside handles perceived load.
const ProfileDetailPage = lazy(() =>
  import("@/pages/ProfileDetailPage").then((m) => ({
    default: m.ProfileDetailPage,
  }))
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route
          path="/profile/:username"
          element={
            <Suspense fallback={null}>
              <ProfileDetailPage />
            </Suspense>
          }
        />
        <Route path="/shortlist" element={<ShortlistPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
