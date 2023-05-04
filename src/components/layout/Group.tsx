import { Slot, component$ } from "@builder.io/qwik";

export default component$(
  (props: { title: string; action: "none" | "showAll" }) => {
    return (
      <section>
        <div class="u-flex u-cross-center u-main-space-between">
          <h1 class="heading-level-3">{props.title}</h1>

          {props.action !== "none" && (
            <button class="button is-text" aria-label="Add new item">
              <span class="text">See All</span>
            </button>
          )}
        </div>

        <div class="u-margin-block-start-16">
          <Slot />
        </div>
      </section>
    );
  }
);
