import { component$ } from "@builder.io/qwik";

export default component$((props: { name: string }) => {
  return (
    <a href="#">
      <div
        class="card u-flex-vertical u-cross-center u-main-center"
        style="padding: 0px;"
      >
        <div style="padding: var(--p-card-padding)">
          <p class=" eyebrow-heading-3">{props.name}</p>

          <p class=" u-margin-block-start-4">
            {" "}
            Templates ready to be used when making new proejct.{" "}
          </p>

          <button class="button is-secondary  u-margin-block-start-16">
            <span class="text">
              View {Math.ceil(Math.random() * 20) + 10} Projects
            </span>
          </button>
        </div>
      </div>
    </a>
  );
});
