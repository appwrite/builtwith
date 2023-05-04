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
      <div class="grid-with-side reverse-grid">
        <Header />
        <main class="main-content">
          <div class="container hero-top-container">
            <Slot />
            <Footer />
          </div>
        </main>
        <aside class="main-side">
          <div class="u-flex u-flex-vertical u-gap-16">
          <div class="card u-flex-vertical u-cross-center u-main-center">
              <p class="u-text-center eyebrow-heading-3">SOME STUFF</p>
            </div>
            <div class="card u-flex-vertical u-cross-center u-main-center">
              <p class="u-text-center eyebrow-heading-3">MORE STUFF</p>
            </div>
            <div class="card u-flex-vertical u-cross-center u-main-center">
              <p class="u-text-center eyebrow-heading-3">OTHER STUFF</p>
            </div>
            <div class="card u-flex-vertical u-cross-center u-main-center">
              <p class="u-text-center eyebrow-heading-3">ADS MAINLY</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
});
