import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <BadgeCheck
      size={15}
      className="inline-block ml-1 text-indigo-500 flex-shrink-0"
      aria-label="Verified account"
      role="img"
    />
  );
}
