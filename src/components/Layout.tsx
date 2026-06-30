import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Users, ListChecks } from "lucide-react";
import { useListStore } from "@/store";
import { ToastContainer } from "./Toast";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const count = useListStore((s) => s.selectedProfiles.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors"
            aria-label="Wobb Influencer Search home"
          >
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users size={15} className="text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Wobb</span>
          </Link>
          <span className="text-gray-300 text-sm">|</span>
          <span className="text-gray-500 text-sm">Influencer Search</span>
          {count > 0 && (
            <div className="ml-auto flex items-center gap-2 text-xs text-gray-600 font-medium">
              <ListChecks size={15} className="text-indigo-500" />
              <span>Shortlist</span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                {count}
              </span>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <ToastContainer />
    </div>
  );
}
