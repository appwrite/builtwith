import { Slot, component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

export default component$((props: { title: string; href?: string }) => {
  const nav = useNavigate();
  return (
    <section>
      <div class="u-flex u-cross-center u-main-space-between">
        <h2 class="eyebrow-heading-2">{props.title}</h2>

        {props.href && (
          <button
            onClick$={async () => await nav(props.href)}
            class="button is-text"
          >
            <span class="text">See All</span>
          </button>
        )}
      </div>

      <div class="u-margin-block-start-16">
        <Slot />
      </div>
    </section>
  );
});
