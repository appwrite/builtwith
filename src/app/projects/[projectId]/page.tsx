import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import xss from "xss";
import { ServerAppwrite } from "~/lib/appwrite-server";
import ProjectTags from "~/components/project-tags";
import Upvote from "~/components/upvote";

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
      if (!href || !/^https?:\/\//i.test(href)) return text;
      const params = new URLSearchParams({ url: href });
      const titleAttr = title ? ` title="${escape(title)}"` : "";
      return `<img src="/api/image-proxy?${params.toString()}" alt="${escape(
        text
      )}"${titleAttr} loading="lazy" decoding="async">`;
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
    return { title: "Project not found | Built with Appwrite" };
  }
  return {
    title: `${project.name} | Built with Appwrite`,
    description: project.tagline,
    openGraph: { title: `${project.name} | Built with Appwrite`, description: project.tagline },
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

  return (
    <>
      <ul className="u-flex u-gap-24 u-flex-vertical-mobile">
        <div className="u-flex-vertical u-gap-24 u-flex-shrink-0 u-flex-basis-50-percent">
          <Link href="/" style={{ padding: 0 }} className="button is-text">
            <span className="icon-cheveron-left" aria-hidden="true" />
            <span className="text">Back to Projects</span>
          </Link>

          <div className="u-flex u-gap-16 u-cross-center">
            <h2 className="heading-level-2">{project.name}</h2>
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
                    <span className="icon-twitter" aria-hidden="true" />
                    <p>Follow on Twitter</p>
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
            <img src={imageSrc} alt="" />
          </div>
        </div>
      </ul>

      <div className="card u-margin-block-start-20">
        <div className="prose" dangerouslySetInnerHTML={{ __html: safeHtml }} />
      </div>
    </>
  );
}
