import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { AppwriteService } from "~/AppwriteService";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$, Link } from "@builder.io/qwik-city";
import { marked } from "marked";
import ProjectTags from "~/components/layout/ProjectTags";
import Upvote from "~/components/blocks/Upvote";
import Socials from "~/components/blocks/Socials";

export const useProjectData = routeLoader$(async ({ params, status }) => {
  try {
    return {
      project: await AppwriteService.getProject(params.projectId),
    };
  } catch {
    status(404);
    return { project: null };
  }
});

export const head: DocumentHead = ({ resolveValue }) => {
  const { project } = resolveValue(useProjectData);

  if (!project)
    return {
      title: "Project not found | Built with Appwrite",
    };

  return {
    title: `${project.name} | Built with Appwrite`,
    meta: [
      {
        name: "description",
        content: project.tagline,
      },
      {
        name: "og:title",
        content: `${project.name} | Built with Appwrite`,
      },
      {
        name: "og:description",
        content: project.tagline,
      },
    ],
  };
};

export default component$(() => {
  const { project } = useProjectData().value;

  if (!project) {
    return (
      <ul class="u-flex u-gap-24 u-flex-vertical-mobile">
        <div class="u-flex-vertical u-gap-24 u-flex-shrink-0 u-flex-basis-50-percent">
          <Link href="/" style="padding: 0px;" class="button is-text">
            <span class="icon-cheveron-left" aria-hidden="true"></span>
            <span class="text">Back to Projects</span>
          </Link>

          <div>
            <h2 class="heading-level-2">Not Found</h2>
            <p class="u-margin-block-start-16" style="font-size: 1rem;">
              This project does not exist.
            </p>
          </div>
        </div>
      </ul>
    );
  }

  const html = marked(project.description, {
    mangle: false,
    headerIds: false,
  });

  useVisibleTask$(async () => {
    const visitedProjects = JSON.parse(
      localStorage.getItem("visitedProjects") ?? "[]"
    ) as string[];

    visitedProjects.unshift(project.$id);

    const visitedProjectsUnique = [...new Set(visitedProjects)];

    localStorage.setItem(
      "visitedProjects",
      JSON.stringify(visitedProjectsUnique)
    );
  });

  return (
    <>
      <ul class="u-flex u-gap-24 u-flex-vertical-mobile">
        <div class="u-flex-vertical u-gap-24 u-flex-shrink-0 u-flex-basis-50-percent">
          <Link href="/" style="padding: 0px;" class="button is-text">
            <span class="icon-cheveron-left" aria-hidden="true"></span>
            <span class="text">Back to Projects</span>
          </Link>

          <div class="u-flex u-gap-16 u-cross-center">
            <h2 class="heading-level-2">{project.name}</h2>
            <Upvote projectId={project.$id} votes={project.upvotes} inline />
          </div>

          <p style="font-size: 1.2rem; margin-top: -1rem;">{project.tagline}</p>

          {(project.urlGooglePlay ||
            project.urlAppStore ||
            project.urlMacOs ||
            project.urlWindows ||
            project.urlLinux) && (
            <div>
              <h4 class="eyebrow-heading-3">Download the Application</h4>

              <div class="u-flex u-flex-wrap u-cross-center u-gap-8 u-margin-block-start-12">
                {project.urlGooglePlay && (
                  <a
                    href={project.urlGooglePlay}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-google" aria-hidden="true"></span>
                    <p>Google Play</p>
                  </a>
                )}

                {project.urlWindows && (
                  <a
                    href={project.urlWindows}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-microsoft" aria-hidden="true"></span>
                    <p>Microsoft Store</p>
                  </a>
                )}

                {project.urlLinux && (
                  <a
                    href={project.urlLinux}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-linux" aria-hidden="true"></span>
                    <p>Linux Store</p>
                  </a>
                )}

                {project.urlAppStore && (
                  <a
                    href={project.urlAppStore}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-apple" aria-hidden="true"></span>
                    <p>App Store (iOS)</p>
                  </a>
                )}

                {project.urlMacOs && (
                  <a
                    href={project.urlMacOs}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-apple" aria-hidden="true"></span>
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
              <h4 class="eyebrow-heading-3">Stay in Touch</h4>

              <div class="u-flex u-flex-wrap u-cross-center u-gap-8 u-margin-block-start-12">
                {project.urlWebsite && (
                  <a
                    href={project.urlWebsite}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-external-link" aria-hidden="true"></span>
                    <p>Visit Website</p>
                  </a>
                )}

                {project.urlGitHub && (
                  <a
                    href={project.urlGitHub}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-github" aria-hidden="true"></span>
                    <p>View on GitHub</p>
                  </a>
                )}
                {project.urlTwitter && (
                  <a
                    href={project.urlTwitter}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-twitter" aria-hidden="true"></span>
                    <p>Follow on Twitter</p>
                  </a>
                )}

                {project.urlArticle && (
                  <a
                    href={project.urlArticle}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-book-open" aria-hidden="true"></span>
                    <p>Read Article</p>
                  </a>
                )}
              </div>
            </div>
          )}

          <div>
            <h4 class="eyebrow-heading-3">Tags</h4>
            <div class="u-flex u-flex-wrap u-gap-8 u-margin-block-start-12">
              <ProjectTags project={project} />
            </div>
          </div>

          <div
            class="u-flex-vertical u-gap-8 u-position-sticky"
            style="--inset-block-start: 5em"
          >
            <h4 class="eyebrow-heading-3">Share</h4>
            <Socials
              url={`https://builtwith.appwrite.io/projects/${project.$id}`}
              title={`Built with Appwrite: ${project.name}`}
              body={project.tagline}
            />
          </div>
        </div>

        <div>
          <div class="object-og object-og-rounded">
            <img src={AppwriteService.getProjectThumbnail(project.imageId)} />
          </div>
        </div>
      </ul>

      <div class="card u-margin-block-start-20">
        <div class="prose" dangerouslySetInnerHTML={html}></div>
      </div>
    </>
  );
});
