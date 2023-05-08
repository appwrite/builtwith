import { component$ } from "@builder.io/qwik";
import Auth from "../icons/Auth";
import Storage from "../icons/Storage";
import Databases from "../icons/Databases";
import Function from "../icons/Function";
import Upvote from "../blocks/Upvote";
import Realtime from "../icons/Realtime";
import { useNavigate } from "@builder.io/qwik-city";
import type { Project } from "~/AppwriteService";
import { AppwriteService } from "~/AppwriteService";

export default component$((props: { project: Project | null }) => {
  const { project } = props;
  const nav = useNavigate();

  return project === null ? (
    <div
      class="is-not-mobile card c-empty-card is-border-dashed u-flex-vertical u-cross-center u-main-center"
      style="padding: 0px; height: 100%;"
    >
      <div
        class="u-flex u-cross-center u-main-center"
        style="padding: var(--p-card-padding); width: 100%; height: 100%;"
      >
        <div
          class="u-flex u-cross-center u-main-space-between"
          style="width: 100%;"
        >
          <div
            style="width: 100%;"
            class="u-flex-vertical u-gap-12 u-main-center u-cross-center"
          >
            <button
              onClick$={async () => await nav("/submit-project")}
              class="button is-secondary"
            >
              <span class="text">Submit Project</span>
            </button>
          </div>
        </div>
      </div>

      <div class="object-og" style="height: 200px;">
        <img class="c-dark-only" src="/images/project-placeholder.png" alt="" />
        <img
          class="c-light-only"
          src="/images/project-placeholder-light.png"
          alt=""
        />
      </div>

      <div style="padding: 1.5rem var(--p-card-padding) 1.5rem var(--p-card-padding); width: 100%;">
        <div
          class="u-flex u-cross-center"
          style="width: 100%; justify-content: space-around;"
        >
          <button
            class="button is-text is-only-icon"
            style="--button-size:1.5rem;"
            aria-label="Remove item"
          >
            <Auth disabled={true} active={false} />
          </button>

          <button
            class="button is-text is-only-icon"
            style="--button-size:1.5rem;"
            aria-label="Remove item"
          >
            <Databases disabled={true} active={false} />
          </button>

          <button
            class="button is-text is-only-icon"
            style="--button-size:1.5rem;"
            aria-label="Remove item"
          >
            <Storage disabled={true} active={false} />
          </button>

          <button
            class="button is-text is-only-icon"
            style="--button-size:1.5rem;"
            aria-label="Remove item"
          >
            <Function disabled={true} active={false} />
          </button>

          <button
            class="button is-text is-only-icon"
            style="--button-size:1.5rem;"
            aria-label="Remove item"
          >
            <Realtime disabled={true} active={false} />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div
        class="card u-flex-vertical u-cross-center u-main-center"
        style="padding: 0px;"
      >
        <div style="padding: var(--p-card-padding); width: 100%;">
          <div
            class="u-flex u-cross-center u-gap-8 u-main-space-between"
            style="width: 100%;"
          >
            <div
              class="u-cursor-pointer"
              onClick$={async () => await nav(`/projects/${project.$id}`)}
            >
              <p class="eyebrow-heading-2 c-trim">{project.name}</p>
              <p class="u-margin-block-start-4 c-trim-2">{project.tagline}</p>
            </div>

            <Upvote projectId={project.$id} votes={project.upvotes} />
          </div>
        </div>

        <div
          class="object-og u-cursor-pointer"
          onClick$={async () => await nav(`/projects/${project.$id}`)}
          style="height: 200px;"
        >
          <img src={AppwriteService.getProjectThumbnail(project.imageId)} />
        </div>

        <div style="padding: 1.5rem var(--p-card-padding) 1.5rem var(--p-card-padding); width: 100%;">
          <div
            class="u-flex u-cross-center"
            style="width: 100%; justify-content: space-around;"
          >
            <div class="tooltip">
              <button
                onClick$={async () => await nav(`/search?service=databases`)}
                class="button is-text is-only-icon"
                style="--button-size:1.5rem;"
                aria-label="Remove item"
              >
                <Databases active={project.services.includes("databases")} />
              </button>
              <span class="tooltip-popup is-bottom" role="tooltip">
                Appwrite Databases
              </span>
            </div>

            <div class="tooltip">
              <button
                class="button is-text is-only-icon"
                style="--button-size:1.5rem;"
                aria-label="Remove item"
                onClick$={async () =>
                  await nav(`/search?service=authentication`)
                }
              >
                <Auth active={project.services.includes("authentication")} />
              </button>
              <span class="tooltip-popup is-bottom" role="tooltip">
                Appwrite Authentication
              </span>
            </div>

            <div class="tooltip">
              <button
                class="button is-text is-only-icon"
                style="--button-size:1.5rem;"
                aria-label="Remove item"
                onClick$={async () => await nav(`/search?service=storage`)}
              >
                <Storage active={project.services.includes("storage")} />
              </button>
              <span class="tooltip-popup is-bottom" role="tooltip">
                Appwrite Storage
              </span>
            </div>

            <div class="tooltip">
              <button
                class="button is-text is-only-icon"
                style="--button-size:1.5rem;"
                aria-label="Remove item"
                onClick$={async () => await nav(`/search?service=functions`)}
              >
                <Function active={project.services.includes("functions")} />
              </button>
              <span class="tooltip-popup is-bottom" role="tooltip">
                Appwrite Functions
              </span>
            </div>

            <div class="tooltip">
              <button
                class="button is-text is-only-icon"
                style="--button-size:1.5rem;"
                aria-label="Remove item"
                onClick$={async () => await nav(`/search?service=realtime`)}
              >
                <Realtime active={project.services.includes("realtime")} />
              </button>
              <span class="tooltip-popup is-bottom" role="tooltip">
                Appwrite Realtime
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
