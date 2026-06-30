import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  FileText,
  Heart,
  MessageCircle,
  Eye,
  ExternalLink,
  Plus,
  Check,
  BadgeCheck,
} from "lucide-react";
import { clsx } from "clsx";
import { Layout } from "@/components/Layout";
import { StatCard, Avatar } from "@/components/ui";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { PLATFORM_COLORS, PLATFORM_BADGE_FALLBACK } from "@/constants/platforms";
import type { FullUserProfile, Platform } from "@/types";
import { formatEngagementRate, formatFollowers, formatNumber } from "@/utils/formatters";
import { useProfileStore, useListStore, useToastStore } from "@/store";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platformParam = searchParams.get("platform") || "";

  const profile = useProfileStore((s) => s.profile);
  const isLoading = useProfileStore((s) => s.isLoading);
  const error = useProfileStore((s) => s.error);
  const loadProfile = useProfileStore((s) => s.loadProfile);
  const reset = useProfileStore((s) => s.reset);

  // List store — same source of truth as the home page Add button
  const isSelected = useListStore((s) =>
    profile ? s.isProfileSelected(profile.user_id) : false
  );
  const addProfile = useListStore((s) => s.addProfile);
  const removeProfile = useListStore((s) => s.removeProfile);
  const showToast = useToastStore((s) => s.showToast);

  useEffect(() => {
    if (!username) return;
    loadProfile(username);
    return () => reset();
  }, [username, loadProfile, reset]);

  // ── Invalid URL
  if (!username) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Invalid profile URL.</p>
          <Link to="/" className="text-indigo-600 text-sm font-medium hover:underline">
            ← Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  // ── Loading
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <ProfileSkeleton />
        </div>
      </Layout>
    );
  }

  // ── Not found / error
  if (error || !profile) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            Back to search
          </Link>
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={22} className="text-gray-400" />
            </div>
            <h2 className="text-gray-900 font-semibold text-base mb-1">Profile not found</h2>
            <p className="text-gray-500 text-sm mb-6">
              Detailed data isn't available for{" "}
              <span className="font-medium">@{username}</span> yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to search
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profile;
  // Derive platform: prefer URL param, fall back to profile's type field
  const platform: Platform =
    (["instagram", "youtube", "tiktok"].includes(platformParam)
      ? platformParam
      : profile.type ?? "youtube") as Platform;
  // Use the shared PLATFORM_COLORS map; fall back for URL params that aren't a known Platform
  const badgeClass = PLATFORM_COLORS[platform as Platform] ?? PLATFORM_BADGE_FALLBACK;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back to search
        </Link>

        {/* ── Hero card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-5">
            <Avatar
              src={user.picture}
              alt={user.fullname}
              size="lg"
              className="border-2 border-white shadow-sm"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                  {user.fullname}
                </h1>
                {user.is_verified && (
                  <BadgeCheck size={18} className="text-indigo-500 flex-shrink-0" aria-label="Verified account" />
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {user.username && (
                  <span className="text-gray-500 text-sm">@{user.username}</span>
                )}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${badgeClass}`}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </span>
              </div>

              {user.description && (
                <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {user.description}
                </p>
              )}
            </div>

            <div className="flex-shrink-0 flex flex-col gap-2 items-end">
              {user.url && (
                <a
                  href={user.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${user.fullname} on platform`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:border-gray-300 hover:text-gray-900 transition-all"
                >
                  <ExternalLink size={12} />
                  View profile
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  if (!profile) return;
                  if (isSelected) {
                    removeProfile(profile.user_id);
                    showToast(`${profile.fullname} removed from shortlist`, "info");
                  } else {
                    addProfile(profile, platform as Platform);
                    showToast(`${profile.fullname} added to shortlist`);
                  }
                }}
                aria-label={isSelected ? `Remove ${user.fullname} from shortlist` : `Add ${user.fullname} to shortlist`}
                aria-pressed={isSelected}
                className={clsx(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                  isSelected
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                )}
              >
                {isSelected ? <><Check size={12} />Added</> : <><Plus size={12} />Add to List</>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard label="Followers" value={formatFollowers(user.followers)} icon={<Users size={12} />} />
          <StatCard label="Eng. Rate" value={formatEngagementRate(user.engagement_rate)} icon={<TrendingUp size={12} />} />
          {user.posts_count !== undefined && (
            <StatCard label="Posts" value={formatNumber(user.posts_count)} icon={<FileText size={12} />} />
          )}
          {user.engagements !== undefined && (
            <StatCard label="Engagements" value={formatFollowers(user.engagements)} icon={<Heart size={12} />} />
          )}
        </div>

        {/* ── Secondary stats */}
        {(user.avg_likes !== undefined || user.avg_comments !== undefined || user.avg_views !== undefined) && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              Averages per post
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {user.avg_likes !== undefined && (
                <div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    <Heart size={11} /><span>Avg Likes</span>
                  </div>
                  <div className="text-base font-semibold text-gray-900">{formatFollowers(user.avg_likes)}</div>
                </div>
              )}
              {user.avg_comments !== undefined && (
                <div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    <MessageCircle size={11} /><span>Avg Comments</span>
                  </div>
                  <div className="text-base font-semibold text-gray-900">{formatNumber(user.avg_comments)}</div>
                </div>
              )}
              {user.avg_views !== undefined && user.avg_views > 0 && (
                <div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                    <Eye size={11} /><span>Avg Views</span>
                  </div>
                  <div className="text-base font-semibold text-gray-900">{formatFollowers(user.avg_views)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
