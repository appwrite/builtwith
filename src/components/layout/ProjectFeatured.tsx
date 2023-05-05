import { component$ } from "@builder.io/qwik";
import Upvote from "../blocks/Upvote";

export default component$(() => {
  return (
    <article class="card u-grid u-cross-center u-min-width-100-percent u-flex-shrink-0">
      <div class="u-flex u-flex-vertical-mobile u-gap-24">
        <a href="#" class="object-og u-flex-basis-50-percent u-flex-shrink-0">
          <img
            src="/project.png"
            alt=""
            style="border-radius: var(--border-radius-medium);"
          />
        </a>

        <div class="u-flex-basis-50-percent">
          <div class="u-flex u-cross-start u-main-space-between">
            <div class="u-flex u-gap-8 u-flex-wrap">
              <a href="#" class="tag">
                <span class="text">React</span>
              </a>
              <a href="#" class="tag">
                <span class="text">Tailwind</span>
              </a>
              <a href="#" class="tag">
                <span class="text">Ecommerce</span>
              </a>
            </div>
            <div>
              <Upvote
                inline={true}
                votes={1256}
                upvoted={Math.random() < 0.5}
              />
            </div>
          </div>

          <a href="#" class="heading-level-3 u-trim u-margin-block-start-8">
            Almost SSR - Qwik
          </a>
          <p class="u-margin-block-start-4" style="font-size: 1rem;">
            Demo application with authorized server-side and client-side
            rendering.
          </p>

          <div class="u-margin-block-start-8 u-flex u-gap-0 u-flex-wrap">
            <div class="u-flex u-gap-4 u-cross-center u-flex-basis-50-percent">
              <span
                class="icon-check u-color-text-success"
                aria-hidden="true"
              ></span>
              <p>Appwrite Databases</p>
            </div>
            <div class="u-flex u-gap-4 u-cross-center u-flex-basis-50-percent">
              <span
                class="icon-check u-color-text-success"
                aria-hidden="true"
              ></span>
              <p>Appwrite Authorization</p>
            </div>
            <div
              class="u-flex u-gap-4 u-cross-center u-flex-basis-50-percent"
              style="color: hsl(var(--color-neutral-150))"
            >
              <span class="icon-x" aria-hidden="true"></span>
              <p>Appwrite Storage</p>
            </div>
            <div class="u-flex u-gap-4 u-cross-center u-flex-basis-50-percent">
              <span
                class="icon-check u-color-text-success"
                aria-hidden="true"
              ></span>
              <p>Appwrite Function</p>
            </div>
            <div class="u-flex u-gap-4 u-cross-center u-flex-basis-50-percent">
              <span
                class="icon-check u-color-text-success"
                style="font-size: 1.5rem"
                aria-hidden="true"
              ></span>
              <p>Appwrite Realtime</p>
            </div>
          </div>

          <div class="u-margin-block-start-16  u-flex u-cross-center u-gap-8">
            <button class="button is-secondary" aria-label="Add new item">
              <span class="icon-github" aria-hidden="true"></span>
            </button>
            <button class="button is-secondary" aria-label="Add new item">
              <span class="icon-twitter" aria-hidden="true"></span>
            </button>
            <button class="button is-secondary" aria-label="Add new item">
              <span class="icon-globe" aria-hidden="true"></span>
            </button>
            <button class="button is-secondary" aria-label="Add new item">
              <span class="icon-book-open" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});
