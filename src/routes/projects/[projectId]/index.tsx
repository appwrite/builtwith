import { component$ } from "@builder.io/qwik";
import { AppwriteService } from "~/AppwriteService";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import * as marked from "marked";
import { Config } from "~/Config";

export const useProjectData = routeLoader$(async ({ params }) => {
  return {
    project: await AppwriteService.getProject(params.projectId),
  };
});

export default component$(() => {
  const nav = useNavigate();
  const projectData = useProjectData();

  const html = marked.marked.parse(projectData.value.project.description);

  const services = {
    databases: {
      used: projectData.value.project.hasDatabases,
      name: "Databases",
    },
    authentication: {
      used: projectData.value.project.hasAuthentication,
      name: "Authentication",
    },
    storage: {
      used: projectData.value.project.hasStorage,
      name: "Storage",
    },
    functions: {
      used: projectData.value.project.hasFunctions,
      name: "Functions",
    },
    realtime: {
      used: projectData.value.project.hasRealtime,
      name: "Realtime",
    },
  };

  return (
    <>
      <ul class="u-flex u-gap-24 u-flex-vertical-mobile">
        <div
          class="u-flex-vertical u-gap-24 u-flex-shrink-0"
          style="flex-basis: 40%;"
        >
          <button
            style="padding: 0px;"
            onClick$={() => nav("/")}
            class="button is-text"
          >
            <span class="icon-cheveron-left" aria-hidden="true"></span>
            <span class="text">Back to Projects</span>
          </button>

          <h2 class="heading-level-2">{projectData.value.project.name}</h2>
          <p style="font-size: 1.2rem; margin-top: -1rem;">
            {projectData.value.project.tagline}
          </p>

          <div class="list">
            <button
              onClick$={async () =>
                await nav(
                  `/search?framework=${projectData.value.project.framework}`
                )
              }
              class="list-item"
            >
              <span class="icon-arrow-circle-right" aria-hidden="true"></span>
              <span class="text">
                {
                  (Config.frameworks as any)[
                    projectData.value.project.framework
                  ].name
                }{" "}
                Framework
              </span>
            </button>
            <button
              onClick$={async () =>
                await nav(
                  `/search?uiLibrary=${projectData.value.project.uiLibrary}`
                )
              }
              class="list-item"
            >
              <span class="icon-arrow-circle-right" aria-hidden="true"></span>

              <span class="text">
                {
                  (Config.uiLibraries as any)[
                    projectData.value.project.uiLibrary
                  ].name
                }{" "}
                UI Library
              </span>
            </button>
            <button
              onClick$={async () =>
                await nav(
                  `/search?useCase=${projectData.value.project.useCase}`
                )
              }
              class="list-item"
            >
              <span class="icon-arrow-circle-right" aria-hidden="true"></span>

              <span class="text">
                {
                  (Config.useCases as any)[projectData.value.project.useCase]
                    .name
                }{" "}
                Use Case
              </span>
            </button>
          </div>

          <div class="u-flex u-cross-center u-gap-8 u-flex-vertical-mobile">
            <div class="u-flex u-cross-center u-gap-8">
              {projectData.value.project.urlGitHub && (
                <div class="tooltip">
                  <a
                    href={projectData.value.project.urlGitHub}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-github" aria-hidden="true"></span>
                  </a>

                  <span class="tooltip-popup is-bottom" role="tooltip">
                    View on GitHub
                  </span>
                </div>
              )}
              {projectData.value.project.urlTwitter && (
                <div class="tooltip">
                  <a
                    href={projectData.value.project.urlTwitter}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-twitter" aria-hidden="true"></span>
                  </a>
                  <span class="tooltip-popup is-bottom" role="tooltip">
                    Follow on Twitter
                  </span>
                </div>
              )}

              {projectData.value.project.urlArticle && (
                <div class="tooltip">
                  <a
                    href={projectData.value.project.urlArticle}
                    target="_blank"
                    class="button is-secondary"
                  >
                    <span class="icon-book-open" aria-hidden="true"></span>
                  </a>
                  <span class="tooltip-popup is-bottom" role="tooltip">
                    Read Article
                  </span>
                </div>
              )}
            </div>

            {projectData.value.project.urlWebsite && (
              <div style="width: 100%;">
                <a
                  href={projectData.value.project.urlWebsite}
                  target="_blank"
                  style="width: 100%;"
                  class="button u-flex u-main-center"
                >
                  <span class="icon-link" aria-hidden="true"></span>
                  <span class="text">Visit Website</span>
                </a>
              </div>
            )}
          </div>

          <div class="u-flex u-gap-8 u-flex-wrap u-main-center u-cross-center">
            {Object.keys(services).map((service) => (
              <button
                key={service}
                onClick$={async () => await nav(`/search?service=${service}`)}
              >
                {(services as any)[service].used ? (
                  <div class="tag is-success">
                    <span class="icon-check-circle" aria-hidden="true"></span>
                    <span class="text">{(services as any)[service].name}</span>
                  </div>
                ) : (
                  <div class="tag is-danger">
                    <span class="icon-x-circle" aria-hidden="true"></span>
                    <span class="text">{(services as any)[service].name}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        <div style="width:100%;" class="u-flex-vertical u-gap-24">
          <div class="object-og u-cursor-pointer " style="width: 100%;">
            <img
              style="border-radius: var(--border-radius-medium);"
              src={AppwriteService.getProjectThumbnail(
                projectData.value.project.imageId
              )}
            />
          </div>

          <div
            class="card"
            style="background-color: hsl(var(--color-neutral-0));"
          >
            <div class="prose prose-slate" dangerouslySetInnerHTML={html}></div>
          </div>
        </div>
      </ul>
    </>
  );
});
