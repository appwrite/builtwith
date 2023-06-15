import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <ul class="u-flex u-gap-24 u-flex-vertical-mobile">
      <div class="u-flex-vertical u-gap-24 u-flex-shrink-0 u-flex-basis-50-percent">
        <Link href="/" style="padding: 0px;" class="button is-text">
          <span class="icon-cheveron-left" aria-hidden="true"></span>
          <span class="text">Back to Projects</span>
        </Link>
        <div>
          <h2 class="heading-level-2">404</h2>
          <p class="u-margin-block-start-16" style="font-size: 1rem;">
            Page not found.
          </p>
        </div>
      </div>
    </ul>
  );
});
