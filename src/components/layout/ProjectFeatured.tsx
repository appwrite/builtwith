import { component$ } from "@builder.io/qwik";
import Upvote from "../blocks/Upvote";
import { AppwriteService, Project } from "~/AppwriteService";
import { Config } from "~/Config";

export default component$((props: { project: Project }) => {
  const { project } = props;

  const framework = (Config.frameworks as any)[project.framework] ?? null;
  const uiLibrary = (Config.uiLibraries as any)[project.uiLibrary] ?? null;
  const useCase = (Config.useCases as any)[project.useCase] ?? null;

  return (
    <article class="card u-grid u-cross-center u-min-width-100-percent u-flex-shrink-0">
      <div class="u-flex u-flex-vertical-mobile u-gap-24">
        <a href="#" class="object-og u-flex-basis-50-percent u-flex-shrink-0">
          <img
            src={AppwriteService.getProjectThumbnail(project.imageId)}
            style="border-radius: var(--border-radius-medium);"
          />
        </a>

        <div class="u-flex-basis-50-percent">
          <div class="u-flex u-flex-vertical-mobile u-cross-start u-gap-8 u-main-space-between">
            <div class="u-flex u-gap-8 u-flex-wrap" style="margin-top: 0.2rem;">
              {framework && (
                <a href={`/search?framework=${project.framework}`} class="tag">
                  <span class="text">{framework.name}</span>
                </a>
              )}
              {uiLibrary && (
                <a href={`/search?uiLibrary=${project.uiLibrary}`} class="tag">
                  <span class="text">{uiLibrary.name}</span>
                </a>
              )}

              {useCase && (
                <a href={`/search?useCase=${project.useCase}`} class="tag">
                  <span class="text">{useCase.name}</span>
                </a>
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

          <a
            href={`/projects/${project.$id}`}
            class="heading-level-3 u-trim u-margin-block-start-8 c-trim"
          >
            {project.name}
          </a>
          <p class="u-margin-block-start-4 c-trim-2" style="font-size: 1rem;">
            {project.tagline}
          </p>

          <div class="u-margin-block-start-8 u-flex u-gap-0 u-flex-wrap u-flex-vertical-mobile">
            <a
              href="search?service=databases"
              class={`u-flex u-gap-4 u-cross-center u-flex-basis-50-percent ${
                project.services.includes("databases")
                  ? ""
                  : "c-service-disabled"
              }`}
            >
              <span
                class={
                  project.services.includes("databases")
                    ? "icon-check u-color-text-success"
                    : "icon-x"
                }
                aria-hidden="true"
              ></span>
              <p>Databases</p>
            </a>

            <a
              href="search?service=auth"
              class={`u-flex u-gap-4 u-cross-center u-flex-basis-50-percent ${
                project.services.includes("auth") ? "" : "c-service-disabled"
              }`}
            >
              <span
                class={
                  project.services.includes("auth")
                    ? "icon-check u-color-text-success"
                    : "icon-x"
                }
                aria-hidden="true"
              ></span>
              <p>Authorization</p>
            </a>
            <a
              href="search?service=storage"
              class={`u-flex u-gap-4 u-cross-center u-flex-basis-50-percent ${
                project.services.includes("storage") ? "" : "c-service-disabled"
              }`}
            >
              <span
                class={
                  project.services.includes("storage")
                    ? "icon-check u-color-text-success"
                    : "icon-x"
                }
                aria-hidden="true"
              ></span>
              <p>Storage</p>
            </a>
            <a
              href="search?service=functions"
              class={`u-flex u-gap-4 u-cross-center u-flex-basis-50-percent ${
                project.services.includes("functions")
                  ? ""
                  : "c-service-disabled"
              }`}
            >
              <span
                class={
                  project.services.includes("functions")
                    ? "icon-check u-color-text-success"
                    : "icon-x"
                }
                aria-hidden="true"
              ></span>
              <p>Functions</p>
            </a>
            <a
              href="search?service=realtime"
              class={`u-flex u-gap-4 u-cross-center u-flex-basis-50-percent ${
                project.services.includes("realtime")
                  ? ""
                  : "c-service-disabled"
              }`}
            >
              <span
                class={
                  project.services.includes("realtime")
                    ? "icon-check u-color-text-success"
                    : "icon-x"
                }
                aria-hidden="true"
              ></span>
              <p>Realtime</p>
            </a>
          </div>

          <div class="u-margin-block-start-16  u-flex u-flex-vertical-mobile u-cross-center u-main-space-between u-gap-8">
            <div class=" u-flex u-cross-center u-gap-8">
              {project.urlGitHub && (
                <a
                  href={project.urlGitHub}
                  target="_blank"
                  class="button is-secondary"
                >
                  <span class="icon-github" aria-hidden="true"></span>
                </a>
              )}
              {project.urlTwitter && (
                <a
                  href={project.urlTwitter}
                  target="_blank"
                  class="button is-secondary"
                >
                  <span class="icon-twitter" aria-hidden="true"></span>
                </a>
              )}

              {project.urlArticle && (
                <a
                  href={project.urlArticle}
                  target="_blank"
                  class="button is-secondary"
                >
                  <span class="icon-book-open" aria-hidden="true"></span>
                </a>
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
