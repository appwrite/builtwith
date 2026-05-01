import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import xss from "xss";
import { ServerAppwrite } from "~/lib/appwrite-server";
import { SITE_URL } from "~/lib/site";
import ProjectTags from "~/components/project-tags";
import Upvote from "~/components/upvote";
import { XIcon } from "~/components/icons";

export const dynamic = "force-dynamic";

const escape = (unsafe: string) =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

marked.use({
  renderer: {
    image(href: string, title: string | null, text: string) {
      // Only allow http(s) URLs; render directly so the server never proxies
      // user-supplied URLs (no SSRF surface). The browser fetches from the
      // host the markdown author chose.
      if (!href || !/^https?:\/\//i.test(href)) return text;
      const titleAttr = title ? ` title="${escape(title)}"` : "";
      return `<img src="${escape(href)}" alt="${escape(
        text
      )}"${titleAttr} loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
    },
  },
});

export async function generateMetadata({
  params,
}: {
  params: { projectId: string };
}): Promise<Metadata> {
  const project = await ServerAppwrite.getProject(params.projectId);
  if (!project) {
    return {
      title: "Project not found",
      robots: { index: false, follow: true },
    };
  }
  // The root layout's title.template adds "| Built with Appwrite".
  const title = project.name;
  const description = project.tagline;
  const url = `${SITE_URL}/projects/${project.$id}`;
  const image = ServerAppwrite.thumbnailUrl(project.imageId, 1200);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: "Built with Appwrite",
      images: [{ url: image, width: 1200, height: 630, alt: `${project.name} screenshot` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await ServerAppwrite.getProject(params.projectId);
  if (!project) notFound();

  const imageSrc = ServerAppwrite.thumbnailUrl(project.imageId);
  const safeHtml = xss(await marked(project.description));
  const url = `${SITE_URL}/projects/${project.$id}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.name,
    description: project.tagline,
    url,
    image: ServerAppwrite.thumbnailUrl(project.imageId, 1200),
    applicationCategory: "WebApplication",
    operatingSystem: project.platform || "Web",
    aggregateRating:
      project.upvotes && project.upvotes > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: 5,
            ratingCount: project.upvotes,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ul className="u-flex u-gap-24 u-flex-vertical-mobile">
        <div className="u-flex-vertical u-gap-24 u-flex-shrink-0 u-flex-basis-50-percent">
          <Link href="/" style={{ padding: 0 }} className="button is-text">
            <span className="icon-cheveron-left" aria-hidden="true" />
            <span className="text">Back to Projects</span>
          </Link>

          <div className="u-flex u-gap-16 u-cross-center">
            <h1 className="heading-level-2">{project.name}</h1>
            <Upvote projectId={project.$id} votes={project.upvotes} />
          </div>

          <p style={{ fontSize: "1.2rem", marginTop: "-1rem" }}>{project.tagline}</p>

          {(project.urlGooglePlay ||
            project.urlAppStore ||
            project.urlMacOs ||
            project.urlWindows ||
            project.urlLinux) && (
            <div>
              <h4 className="eyebrow-heading-3">Download the Application</h4>
              <div className="u-flex u-flex-wrap u-cross-center u-gap-8 u-margin-block-start-12">
                {project.urlGooglePlay && (
                  <a href={project.urlGooglePlay} target="_blank" rel="noreferrer" className="button is-secondary">
                    <span className="icon-google" aria-hidden="true" />
                    <p>Google Play</p>
                  </a>
                )}
                {project.urlWindows && (
                  <a href={project.urlWindows} target="_blank" rel="noreferrer" className="button is-secondary">
                    <span className="icon-microsoft" aria-hidden="true" />
                    <p>Microsoft Store</p>
                  </a>
                )}
                {project.urlLinux && (
                  <a href={project.urlLinux} target="_blank" rel="noreferrer" className="button is-secondary">
                    <span className="icon-linux" aria-hidden="true" />
                    <p>Linux Store</p>
                  </a>
                )}
                {project.urlAppStore && (
                  <a href={project.urlAppStore} target="_blank" rel="noreferrer" className="button is-secondary">
                    <span className="icon-apple" aria-hidden="true" />
                    <p>App Store (iOS)</p>
                  </a>
                )}
                {project.urlMacOs && (
                  <a href={project.urlMacOs} target="_blank" rel="noreferrer" className="button is-secondary">
                    <span className="icon-apple" aria-hidden="true" />
                    <p>App Store (macOS)</p>
                  </a>
                )}
              </div>
            </div>
          )}

          {(project.urlWebsite ||
            project.urlGitHub ||
            project.urlTwitter ||
            project.urlArticle) && (
            <div>
              <h4 className="eyebrow-heading-3">Stay in Touch</h4>
              <div className="u-flex u-flex-wrap u-cross-center u-gap-8 u-margin-block-start-12">
                {project.urlWebsite && (
                  <a href={project.urlWebsite} target="_blank" rel="noreferrer" className="button is-secondary">
                    <span className="icon-external-link" aria-hidden="true" />
                    <p>Visit Website</p>
                  </a>
                )}
                {project.urlGitHub && (
                  <a href={project.urlGitHub} target="_blank" rel="noreferrer" className="button is-secondary">
                    <span className="icon-github" aria-hidden="true" />
                    <p>View on GitHub</p>
                  </a>
                )}
                {project.urlTwitter && (
                  <a href={project.urlTwitter} target="_blank" rel="noreferrer" className="button is-secondary">
                    <XIcon />
                    <p>Follow on X</p>
                  </a>
                )}
                {project.urlArticle && (
                  <a href={project.urlArticle} target="_blank" rel="noreferrer" className="button is-secondary">
                    <span className="icon-book-open" aria-hidden="true" />
                    <p>Read Article</p>
                  </a>
                )}
              </div>
            </div>
          )}

          <div>
            <h4 className="eyebrow-heading-3">Tags</h4>
            <div className="u-flex u-flex-wrap u-gap-8 u-margin-block-start-12">
              <ProjectTags project={project} />
            </div>
          </div>
        </div>

        <div>
          <div className="object-og object-og-rounded">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageSrc} alt={`${project.name} screenshot`} />
          </div>
        </div>
      </ul>

      <div className="card u-margin-block-start-20">
        <div className="prose" dangerouslySetInnerHTML={{ __html: safeHtml }} />
      </div>
    </>
  );
}
