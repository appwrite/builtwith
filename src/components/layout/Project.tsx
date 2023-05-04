import { $, component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
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
              <p class="u-margin-block-start-4">
                Demo application with authorized server-side and client-side
                rendering.
              </p>
            </div>

            <button
              class="button is-secondary upvote-button"
              aria-label="Upvote"
            >
              <span class="icon-heart" aria-hidden="true"></span>
              <span class="text">120</span>
            </button>
          </div>
        </div>

        <div class="object-og">
          <img
            style="border-radius: var(--border-radius-medium); border-top-left-radius: 0px !important; border-top-right-radius: 0px !important;"
            src="/project.png"
            alt=""
          />
        </div>
      </div>
    </a>
  );
});
