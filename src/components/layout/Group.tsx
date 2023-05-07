import { Slot, component$ } from "@builder.io/qwik";

export default component$((props: { title: string; href?: string }) => {
  return (
    <section>
      <div class="u-flex u-cross-center u-main-space-between">
        <h1 class="heading-level-3">{props.title}</h1>

        {props.href && (
          <a href={props.href} class="button is-text">
            <span class="text">See All</span>
          </a>
        )}
      </div>

      <div class="u-margin-block-start-16">
        <Slot />
      </div>
    </section>
  );
});
