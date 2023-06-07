import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { AppwriteService } from "~/AppwriteService";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { marked } from "marked";
import ProjectTags from "~/components/layout/ProjectTags";
import Upvote from "~/components/blocks/Upvote";
import Socials from "~/components/blocks/Socials";

export const useProjectData = routeLoader$(async ({ params }) => {
  return {
    project: await AppwriteService.getProject(params.projectId),
  };
});

export const head: DocumentHead = ({ resolveValue }) => {
  const projectData = resolveValue(useProjectData);

  return {
    title: `${projectData.project.name} | Built with Appwrite`,
    meta: [
      {
        name: "description",
        content: projectData.project.tagline,
      },
      {
        name: "og:title",
        content: `${projectData.project.name} | Built with Appwrite`,
      },
      {
        name: "og:description",
        content: projectData.project.tagline,
      },
    ],
  };
};

export default component$(() => {
  const nav = useNavigate();
  const projectData = useProjectData();

  const html = marked(projectData.value.project.description, {
    mangle: false,
    headerIds: false,
  });

  useVisibleTask$(async () => {
    const visitedProjects = JSON.parse(
      localStorage.getItem("visitedProjects") ?? "[]"
    ) as string[];

    visitedProjects.unshift(projectData.value.project.$id);

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
          <button
            style="padding: 0px;"
            onClick$={() => nav("/")}
            class="button is-text"
          >
            <span class="icon-cheveron-left" aria-hidden="true"></span>
            <span class="text">Back to Projects</span>
          </button>

          <div class="u-flex u-gap-16 u-cross-center">
            <h2 class="heading-level-2">{projectData.value.project.name}</h2>
            <Upvote
              projectId={projectData.value.project.$id}
              votes={projectData.value.project.upvotes}
              inline
            />
          </div>

          <p style="font-size: 1.2rem; margin-top: -1rem;">
            {projectData.value.project.tagline}
          </p>

          {(projectData.value.project.urlGooglePlay ||
            projectData.value.project.urlAppStore ||
            projectData.value.project.urlMacOs ||
            projectData.value.project.urlWindows ||
            projectData.value.project.urlLinux) && (
            <div>
              <h4 class="eyebrow-heading-3">Download the Application</h4>

              <div class="u-flex u-flex-wrap u-cross-center u-gap-8 u-margin-block-start-12">
                {projectData.value.project.urlGooglePlay && (
                  <a
                    href={projectData.value.project.urlGooglePlay}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-google" aria-hidden="true"></span>
                    <p>Google Play</p>
                  </a>
                )}

                {projectData.value.project.urlWindows && (
                  <a
                    href={projectData.value.project.urlWindows}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-microsoft" aria-hidden="true"></span>
                    <p>Microsoft Store</p>
                  </a>
                )}

                {projectData.value.project.urlLinux && (
                  <a
                    href={projectData.value.project.urlLinux}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-linux" aria-hidden="true"></span>
                    <p>Linux Store</p>
                  </a>
                )}

                {projectData.value.project.urlAppStore && (
                  <a
                    href={projectData.value.project.urlAppStore}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-apple" aria-hidden="true"></span>
                    <p>App Store (iOS)</p>
                  </a>
                )}

                {projectData.value.project.urlMacOs && (
                  <a
                    href={projectData.value.project.urlMacOs}
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

          {(projectData.value.project.urlWebsite ||
            projectData.value.project.urlGitHub ||
            projectData.value.project.urlTwitter ||
            projectData.value.project.urlArticle) && (
            <div>
              <h4 class="eyebrow-heading-3">Stay in Touch</h4>

              <div class="u-flex u-flex-wrap u-cross-center u-gap-8 u-margin-block-start-12">
                {projectData.value.project.urlWebsite && (
                  <a
                    href={projectData.value.project.urlWebsite}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-external-link" aria-hidden="true"></span>
                    <p>Visit Website</p>
                  </a>
                )}

                {projectData.value.project.urlGitHub && (
                  <a
                    href={projectData.value.project.urlGitHub}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-github" aria-hidden="true"></span>
                    <p>View on GitHub</p>
                  </a>
                )}
                {projectData.value.project.urlTwitter && (
                  <a
                    href={projectData.value.project.urlTwitter}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-twitter" aria-hidden="true"></span>
                    <p>Follow on Twitter</p>
                  </a>
                )}

                {projectData.value.project.urlArticle && (
                  <a
                    href={projectData.value.project.urlArticle}
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
              <ProjectTags project={projectData.value.project} />
            </div>
          </div>

          <div
            class="u-flex-vertical u-gap-8 u-position-sticky"
            style="--inset-block-start: 5em"
          >
            <h4 class="eyebrow-heading-3">Share</h4>
            <Socials
              url={`https://builtwith.appwrite.io/projects/${projectData.value.project.$id}`}
              title={`Built with Appwrite: ${projectData.value.project.name}`}
              body={projectData.value.project.tagline}
            />
          </div>
        </div>

        <div>
          <div class="object-og object-og-rounded">
            <img
              src={AppwriteService.getProjectThumbnail(
                projectData.value.project.imageId
              )}
            />
          </div>
        </div>
      </ul>

      <div class="card u-margin-block-start-20">
        <div class="prose" dangerouslySetInnerHTML={html}></div>
      </div>
    </>
  );
});
