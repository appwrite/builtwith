import Link from "next/link";
import type { Metadata } from "next";
import { ServerAppwrite } from "~/lib/appwrite-server";
import {
  buildSearchQueries,
  titleFromParams,
  type RawSearchParams,
} from "~/lib/queries";
import ProjectFeatured from "~/components/project-featured";
import { SITE_URL } from "~/lib/site";

export const dynamic = "force-dynamic";

const FILTER_KEYS = [
  "framework",
  "platform",
  "uiLibrary",
  "useCase",
  "service",
] as const;

const firstParam = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v.join(",") : v;

// A page is indexable iff it expresses exactly one filter, with a single
// (non-comma) value, and no sort modifier. Combinations, sort-only views,
// and empty result pages are noindex,follow.
function indexableSingleFilter(
  raw: RawSearchParams
): { key: (typeof FILTER_KEYS)[number]; val: string } | null {
  const present = FILTER_KEYS.filter((k) => firstParam(raw[k]));
  if (present.length !== 1) return null;
  if (firstParam(raw.sort)) return null;
  const key = present[0];
  const val = firstParam(raw[key]);
  if (!val || val.includes(",")) return null;
  return { key, val };
}

function descriptionFromParams(raw: RawSearchParams): string {
  const framework = firstParam(raw.framework);
  const platform = firstParam(raw.platform);
  const uiLibrary = firstParam(raw.uiLibrary);
  const useCase = firstParam(raw.useCase);
  const service = firstParam(raw.service);
  if (framework)
    return `Discover Appwrite projects built with ${framework}. Browse the directory to find tools, demos, and starters made with this framework.`;
  if (platform)
    return `Explore Appwrite projects targeting ${platform}. See what the community is building for this platform.`;
  if (uiLibrary)
    return `Browse Appwrite projects designed with ${uiLibrary}. Find ideas and starters that pair Appwrite with this UI library.`;
  if (useCase)
    return `Find ${useCase} projects built with Appwrite — real applications shipped by the community.`;
  if (service)
    return `See projects using Appwrite ${service} in production. Get inspiration from how others integrate this service.`;
  return "Browse the directory of projects built with Appwrite.";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: RawSearchParams;
}): Promise<Metadata> {
  // The root layout's title.template adds "| Built with Appwrite", so this
  // returns just the page-specific portion.
  const title = titleFromParams(searchParams);
  const description = descriptionFromParams(searchParams);
  const single = indexableSingleFilter(searchParams);
  const canonical = single
    ? `${SITE_URL}/search?${single.key}=${encodeURIComponent(single.val)}`
    : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical ?? `${SITE_URL}/search`,
      images: [
        { url: "/cover.png", width: 1200, height: 630, alt: "Built with Appwrite" },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/cover.png"],
    },
    robots: single ? undefined : { index: false, follow: true },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: RawSearchParams;
}) {
  const queries = buildSearchQueries(searchParams);
  const projects = await ServerAppwrite.listProjects(queries);
  const title = titleFromParams(searchParams);
  const single = indexableSingleFilter(searchParams);
  const canonicalUrl = single
    ? `${SITE_URL}/search?${single.key}=${encodeURIComponent(single.val)}`
    : `${SITE_URL}/search`;

  // ItemList structured data — only emit on indexable single-filter pages so
  // crawlers don't ingest combination/empty/sort-only variants.
  const jsonLd = single
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: title,
        url: canonicalUrl,
        numberOfItems: projects.length,
        itemListElement: projects.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE_URL}/projects/${p.$id}`,
          name: p.name,
        })),
      }
    : null;

  return (
    <div className="u-flex-vertical u-gap-32">
      <header>
        <h1 className="eyebrow-heading-2">{title}</h1>
      </header>

      <div className="u-flex-vertical u-gap-32">
        {projects.length === 0 && (
          <article className="card u-grid u-cross-center u-min-width-100-percent u-flex-shrink-0 common-section">
            <div className="u-flex u-flex-vertical u-cross-center u-gap-24">
              <div className="u-text-center">
                <h2 className="heading-level-7 u-trim-1">
                  <span className="text u-margin-block-start-8">
                    No Projects Found.
                  </span>
                </h2>
                <p className="text u-margin-block-start-8">
                  It&apos;s your time to shine!
                </p>
              </div>
              <div className="u-flex u-gap-16 u-main-center">
                <Link href="/submit-project" className="button is-secondary">
                  <span className="text">Submit Project</span>
                </Link>
              </div>
            </div>
          </article>
        )}

        {projects.map((project, index) => (
          <ProjectFeatured
            key={project.$id}
            project={project}
            lazy={index > 0}
          />
        ))}
      </div>

      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </div>
  );
}
