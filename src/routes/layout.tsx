import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import Footer from "~/components/layout/Footer";
import Header from "~/components/layout/Header";

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  return (
    <>
      <div class="grid-with-side">
        <Header />
        <main class="main-content">
          <div class="container hero-top-container">
            <Slot />
            <Footer />
          </div>
        </main>
        <aside class="main-side">
          <div
            class="u-flex u-flex-vertical u-gap-16"
            style="margin-left: 1rem"
          >
            <div>
              <button
                style="width: 100%;"
                class="u-flex u-main-space-between u-cross-center"
              >
                <h4 class="eyebrow-heading-3">Service</h4>
                <span
                  class="icon-cheveron-down"
                  style="transform: rotate(180deg);"
                ></span>
              </button>

              <div class="u-flex-vertical u-gap-8 u-margin-block-start-8">
                <div
                  class="u-flex u-cross-center u-gap-8"
                  style="background: hsl(var(--color-neutral-300)); border-radius: var(--border-radius-xsmall); padding: 0.5rem;"
                >
                  <input type="checkbox" style="width: 16px; height: 16px;" />
                  <p>Databases</p>
                </div>
                <div
                  class="u-flex u-cross-center u-gap-8"
                  style="background: hsl(var(--color-neutral-300)); border-radius: var(--border-radius-xsmall); padding: 0.5rem;"
                >
                  <input type="checkbox" style="width: 16px; height: 16px;" />
                  <p>Authentication</p>
                </div>
                <div
                  class="u-flex u-cross-center u-gap-8"
                  style="background: hsl(var(--color-neutral-300)); border-radius: var(--border-radius-xsmall); padding: 0.5rem;"
                >
                  <input type="checkbox" style="width: 16px; height: 16px;" />
                  <p>Storage</p>
                </div>
                <div
                  class="u-flex u-cross-center u-gap-8"
                  style="background: hsl(var(--color-neutral-300)); border-radius: var(--border-radius-xsmall); padding: 0.5rem;"
                >
                  <input type="checkbox" style="width: 16px; height: 16px;" />
                  <p>Functions</p>
                </div>
                <div
                  class="u-flex u-cross-center u-gap-8"
                  style="background: hsl(var(--color-neutral-300)); border-radius: var(--border-radius-xsmall); padding: 0.5rem;"
                >
                  <input type="checkbox" style="width: 16px; height: 16px;" />
                  <p>Realtime</p>
                </div>
              </div>
            </div>

            <div>
              <button
                style="width: 100%;"
                class="u-flex u-main-space-between u-cross-center"
              >
                <h4 class="eyebrow-heading-3">Framework</h4>
                <span class="icon-cheveron-down"></span>
              </button>
            </div>

            <div>
              <button
                style="width: 100%;"
                class="u-flex u-main-space-between u-cross-center"
              >
                <h4 class="eyebrow-heading-3">UI Library</h4>
                <span class="icon-cheveron-down"></span>
              </button>
            </div>

            <div>
              <button
                style="width: 100%;"
                class="u-flex u-main-space-between u-cross-center"
              >
                <h4 class="eyebrow-heading-3">Use Case</h4>
                <span class="icon-cheveron-down"></span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
});
