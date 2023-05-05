import { component$ } from "@builder.io/qwik";
import Auth from "../icons/Auth";
import Storage from "../icons/Storage";
import Databases from "../icons/Databases";
import Function from "../icons/Function";
import Upvote from "../blocks/Upvote";
import Realtime from "../icons/Realtime";

export default component$(() => {
  const isEmpty = Math.random() < 0.5;

  return isEmpty ? (
    <div
      class="card is-border-dashed u-flex-vertical u-cross-center u-main-center"
      style="padding: 0px; background: hsl(var(--color-neutral-400)); height: 100%;"
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
            <button class="button is-secondary">
              <span class="text">Submit Project</span>
            </button>
          </div>
        </div>
      </div>

      <div class="object-og">
        <img src="/images/project-placeholder.png" alt="" />
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
    <a href="#">
      <div
        class="card u-flex-vertical u-cross-center u-main-center"
        style="padding: 0px;"
      >
        <div style="padding: var(--p-card-padding); width: 100%;">
          <div
            class="u-flex u-cross-center u-main-space-between"
            style="width: 100%;"
          >
            <div>
              <p class="eyebrow-heading-2 u-trim  ">Almost SSR - Qwik</p>
              <p class="u-margin-block-start-4 c-trim">
                Demo application with authorized server-side and client-side
                rendering.
              </p>
            </div>

            <Upvote
              votes={Math.ceil(Math.random() * 100) + 30}
              upvoted={Math.random() < 0.5}
            />
          </div>
        </div>

        <div class="object-og">
          <img src="/project.png" alt="" />
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
              <Auth active={Math.random() < 0.5} />
            </button>

            <button
              class="button is-text is-only-icon"
              style="--button-size:1.5rem;"
              aria-label="Remove item"
            >
              <Databases active={Math.random() < 0.5} />
            </button>

            <button
              class="button is-text is-only-icon"
              style="--button-size:1.5rem;"
              aria-label="Remove item"
            >
              <Storage active={Math.random() < 0.5} />
            </button>

            <button
              class="button is-text is-only-icon"
              style="--button-size:1.5rem;"
              aria-label="Remove item"
            >
              <Function active={Math.random() < 0.5} />
            </button>

            <button
              class="button is-text is-only-icon"
              style="--button-size:1.5rem;"
              aria-label="Remove item"
            >
              <Realtime active={Math.random() < 0.5} />
            </button>
          </div>
        </div>
      </div>
    </a>
  );
});
