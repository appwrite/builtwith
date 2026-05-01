import { createFileRoute } from "@tanstack/react-router";
import { ServerAppwrite } from "~/lib/appwrite-server";
import { Config } from "~/lib/config";
import { SITE_URL } from "~/lib/site";

const Q = ServerAppwrite.Query;
type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "daily" | "weekly";
  priority: number;
};

// Appwrite Cloud caps a single guest read at 100 documents, so page through
// with cursorAfter until the response is shorter than the page size.
async function listAllProjectIds(): Promise<
  { id: string; updatedAt: string }[]
> {
  const out: { id: string; updatedAt: string }[] = [];
  const PAGE = 100;
  let cursor: string | undefined;
  for (let i = 0; i < 50; i++) {
    const queries = [Q.orderDesc("$createdAt"), Q.limit(PAGE)];
    if (cursor) queries.push(Q.cursorAfter(cursor));
    const docs = await ServerAppwrite.listProjects(queries);
    for (const d of docs) out.push({ id: d.$id, updatedAt: d.$updatedAt });
    if (docs.length < PAGE) break;
    cursor = docs[docs.length - 1].$id;
  }
  return out;
}

async function sitemap(): Promise<SitemapEntry[]> {
  const now = new Date();

  const home = {
    url: `${SITE_URL}/`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 1,
  };

  // Single-filter category pages — these are the high-value indexable
  // search URLs. Combinations and sort-only pages are explicitly noindexed
  // by /search itself, so we don't list them here.
  const categories: SitemapEntry[] = [];
  for (const id of Object.keys(Config.platforms)) {
    categories.push({
      url: `${SITE_URL}/search?platform=${encodeURIComponent(id)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  for (const id of Object.keys(Config.frameworks)) {
    categories.push({
      url: `${SITE_URL}/search?framework=${encodeURIComponent(id)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  for (const id of Object.keys(Config.uiLibraries)) {
    categories.push({
      url: `${SITE_URL}/search?uiLibrary=${encodeURIComponent(id)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  for (const id of Object.keys(Config.useCases)) {
    categories.push({
      url: `${SITE_URL}/search?useCase=${encodeURIComponent(id)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }
  for (const id of Object.keys(Config.services)) {
    categories.push({
      url: `${SITE_URL}/search?service=${encodeURIComponent(id)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  let projects: SitemapEntry[] = [];
  try {
    const all = await listAllProjectIds();
    projects = all.map((p) => ({
      url: `${SITE_URL}/projects/${p.id}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // If Appwrite is unreachable at build/sitemap time, still serve the
    // static portion rather than 500.
  }

  return [home, ...categories, ...projects];
}

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const serializeSitemap = (entries: SitemapEntry[]) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    ),
    "</urlset>",
    "",
  ].join("\n");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () =>
        new Response(serializeSitemap(await sitemap()), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        }),
    },
  },
});
