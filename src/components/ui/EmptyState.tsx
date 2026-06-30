import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

/**
 * Generic empty state shell.
 * Replaces the structurally identical empty states in ProfileList and
 * SelectedProfilesPanel — previously two hand-rolled copies.
 */
export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-gray-100">
        {icon}
      </div>
      <p className="text-gray-900 font-medium text-sm mb-1">{title}</p>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
