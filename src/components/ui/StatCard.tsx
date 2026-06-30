import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
}

/**
 * Small metric display card.
 * Extracted from ProfileDetailPage where it was an inline private component —
 * promoting it here makes it available to any future page or component.
 */
export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1.5">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-xl font-semibold text-gray-900 tracking-tight">
        {value}
      </div>
    </div>
  );
}
