import { Slot, component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$((props: { title: string; href?: string }) => {
  return (
    <section>
      <div class="u-flex u-cross-center u-main-space-between">
        <h2 class="eyebrow-heading-2">{props.title}</h2>

        {props.href && (
          <Link href={props.href} class="button is-text">
            <span class="text">See All</span>
          </Link>
        )}
      </div>

      <div class="u-margin-block-start-16">
        <Slot />
      </div>
    </section>
  );
});
