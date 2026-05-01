import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ServerAppwrite } from "~/lib/appwrite-server";
import {
  buildSearchQueries,
  titleFromParams,
  type RawSearchParams,
} from "~/lib/queries";
import ProjectFeatured from "~/components/project-featured";
import { SITE_URL } from "~/lib/site";

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

const toRawSearchParams = (search: Record<string, unknown>): RawSearchParams =>
  Object.fromEntries(
    Object.entries(search).map(([key, value]) => [
      key,
      Array.isArray(value)
        ? value.map(String)
        : value == null
          ? undefined
          : String(value),
    ])
  );

const getSearchData = createServerFn({ method: "GET" })
  .inputValidator((raw: RawSearchParams) => raw)
  .handler(async ({ data: searchParams }) => {
    const queries = buildSearchQueries(searchParams);
    return ServerAppwrite.listProjects(queries);
  });

export const Route = createFileRoute("/search")({
  validateSearch: (search) => toRawSearchParams(search),
  // Declare the loader's dependency on the search object so changing filters
  // (e.g. clicking another platform in the sidebar) invalidates the cached
  // loader result and re-runs it. Without loaderDeps, TanStack Router treats
  // search-only navigations as a no-op and useLoaderData keeps returning
  // stale data while the URL updates underneath.
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }) => {
    const searchParams = deps.search;
    return {
      projects: await getSearchData({ data: searchParams }),
      searchParams,
    };
  },
  head: ({ loaderData }) => {
    const searchParams = loaderData?.searchParams ?? {};
    const title = titleFromParams(searchParams);
    const description = descriptionFromParams(searchParams);
    const single = indexableSingleFilter(searchParams);
    const canonical = single
      ? `${SITE_URL}/search?${single.key}=${encodeURIComponent(single.val)}`
      : undefined;

    return {
      meta: [
        { title: `${title} | Built with Appwrite` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical ?? `${SITE_URL}/search` },
        { property: "og:image", content: "/cover.png" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "Built with Appwrite" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: "/cover.png" },
        ...(single ? [] : [{ name: "robots", content: "noindex,follow" }]),
      ],
      links: canonical ? [{ rel: "canonical", href: canonical }] : [],
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { projects, searchParams } = Route.useLoaderData();
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
                <Link to="/submit-project" className="button is-secondary">
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
