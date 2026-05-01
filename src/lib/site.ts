// Single source of truth for the canonical site origin used in metadata,
// sitemap, robots, JSON-LD, and OG URLs. Override via NEXT_PUBLIC_SITE_URL
// in deploy environments that map a custom domain.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://builtwith.appwrite.network"
).replace(/\/+$/, "");
