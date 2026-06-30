export function formatFollowers(count: number): string {
  if (count >= 1000000) {
    const val = count / 1000000;
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + "M";
  }
  if (count >= 1000) {
    const val = count / 1000;
    return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + "K";
  }
  return count.toString();
}

export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}

/**
 * Locale-aware integer formatting (e.g. 12345 → "12,345").
 * Use this instead of calling .toLocaleString() directly in JSX so that
 * formatting is centralized and easy to change globally.
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}
