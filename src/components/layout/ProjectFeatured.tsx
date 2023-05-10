import { component$ } from "@builder.io/qwik";
import Upvote from "../blocks/Upvote";
import { AppwriteService, type Project } from "~/AppwriteService";
import { Config } from "~/Config";
import { useNavigate } from "@builder.io/qwik-city";

export default component$((props: { project: Project }) => {
  const nav = useNavigate();
  const { project } = props;

  const framework = (Config.frameworks as any)[project.framework] ?? null;
  const uiLibrary = (Config.uiLibraries as any)[project.uiLibrary] ?? null;
  const useCase = (Config.useCases as any)[project.useCase] ?? null;

  return (
    <article class="card u-grid u-cross-center u-min-width-100-percent u-flex-shrink-0">
      <div class="u-flex u-flex-vertical-mobile u-gap-24">
        <button
          onClick$={async () => await nav(`/projects/${project.$id}`)}
          class="object-og u-flex-basis-50-percent u-flex-shrink-0"
        >
          <img
            src={AppwriteService.getProjectThumbnail(project.imageId, 1920)}
            style="border-radius: var(--border-radius-medium);"
          />
        </button>

        <div class="u-flex-basis-50-percent">
          <div class="u-flex u-flex-vertical-mobile u-cross-start u-gap-8 u-main-space-between">
            <div class="u-flex u-gap-8 u-flex-wrap" style="margin-top: 0.2rem;">
              {framework && (
                <button
                  onClick$={async () =>
                    await nav(`/search?framework=${project.framework}`)
                  }
                  class="tag"
                >
                  <span class="text">{framework.name}</span>
                </button>
              )}
              {uiLibrary && (
                <button
                  onClick$={async () =>
                    await nav(`/search?uiLibrary=${project.uiLibrary}`)
                  }
                  class="tag"
                >
                  <span class="text">{uiLibrary.name}</span>
                </button>
              )}

              {useCase && (
                <button
                  onClick$={async () =>
                    await nav(`/search?useCase=${project.useCase}`)
                  }
                  class="tag"
                >
                  <span class="text">{useCase.name}</span>
                </button>
              )}
            </div>
            <div>
              <Upvote
                projectId={project.$id}
                inline={true}
                votes={project.upvotes}
              />
            </div>
          </div>

          <button
            onClick$={async () => await nav(`/projects/${project.$id}`)}
            class="heading-level-3 u-trim u-margin-block-start-8 c-trim"
          >
            {project.name}
          </button>
          <p class="u-margin-block-start-4 c-trim-2" style="font-size: 1rem;">
            {project.tagline}
          </p>

          <div class="u-margin-block-start-8 u-flex u-gap-0 u-flex-wrap u-flex-vertical-mobile">
            <button
              onClick$={async () => await nav("/search?service=databases")}
              class={`u-flex u-gap-4 u-cross-center u-flex-basis-50-percent ${
                project.hasDatabases ? "" : "c-service-disabled"
              }`}
            >
              <span
                class={
                  project.hasDatabases
                    ? "icon-check u-color-text-success"
                    : "icon-x u-color-text-danger"
                }
                aria-hidden="true"
              ></span>
              <p>Databases</p>
            </button>

            <button
              onClick$={async () => await nav("/search?service=authentication")}
              class={`u-flex u-gap-4 u-cross-center u-flex-basis-50-percent ${
                project.hasAuthentication ? "" : "c-service-disabled"
              }`}
            >
              <span
                class={
                  project.hasAuthentication
                    ? "icon-check u-color-text-success"
                    : "icon-x u-color-text-danger"
                }
                aria-hidden="true"
              ></span>
              <p>Authentication</p>
            </button>
            <button
              onClick$={async () => await nav("/search?service=storage")}
              class={`u-flex u-gap-4 u-cross-center u-flex-basis-50-percent ${
                project.hasStorage ? "" : "c-service-disabled"
              }`}
            >
              <span
                class={
                  project.hasStorage
                    ? "icon-check u-color-text-success"
                    : "icon-x u-color-text-danger"
                }
                aria-hidden="true"
              ></span>
              <p>Storage</p>
            </button>
            <button
              onClick$={async () => await nav("/search?service=functions")}
              class={`u-flex u-gap-4 u-cross-center u-flex-basis-50-percent ${
                project.hasFunctions ? "" : "c-service-disabled"
              }`}
            >
              <span
                class={
                  project.hasFunctions
                    ? "icon-check u-color-text-success"
                    : "icon-x u-color-text-danger"
                }
                aria-hidden="true"
              ></span>
              <p>Functions</p>
            </button>
            <button
              onClick$={async () => await nav("/search?service=realtime")}
              class={`u-flex u-gap-4 u-cross-center u-flex-basis-50-percent ${
                project.hasRealtime ? "" : "c-service-disabled"
              }`}
            >
              <span
                class={
                  project.hasRealtime
                    ? "icon-check u-color-text-success"
                    : "icon-x u-color-text-danger"
                }
                aria-hidden="true"
              ></span>
              <p>Realtime</p>
            </button>
          </div>

          <div class="u-margin-block-start-16  u-flex u-flex-vertical-mobile u-cross-center u-main-space-between u-gap-8">
            <div class=" u-flex u-cross-center u-gap-8">
              {project.urlGitHub && (
                <div class="tooltip">
                  <a
                    href={project.urlGitHub}
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
              {project.urlTwitter && (
                <div class="tooltip">
                  <a
                    href={project.urlTwitter}
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

              {project.urlArticle && (
                <div class="tooltip">
                  <a
                    href={project.urlArticle}
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
            <div class=" u-flex u-cross-center u-gap-8">
              {project.urlWebsite && (
                <a
                  href={project.urlWebsite}
                  target="_blank"
                  class="button is-secondary"
                >
                  <span class="icon-link" aria-hidden="true"></span>
                  <p class="text">Visit Website</p>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});
