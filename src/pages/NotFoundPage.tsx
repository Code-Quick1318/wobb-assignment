import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import { Layout } from "@/components/Layout";

export function NotFoundPage() {
  return (
    <Layout>
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <SearchX size={28} className="text-gray-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to search
        </Link>
      </div>
    </Layout>
  );
}
