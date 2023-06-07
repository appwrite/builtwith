import { Slot, component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$((props: { id: string; name: string }) => {
  return (
    <Link
      href={`/search?service=${props.id}`}
      class="card u-flex-vertical u-cross-center u-main-space u-overflow-hidden u-width-full-line"
      style="padding: 0px;"
    >
      <div class="c-service-container u-stretch">
        <Slot />
      </div>

      <div style="padding: var(--p-card-padding)">
        <p class="u-text-center heading-level-5" style="font-size: 1.1rem;">
          {props.name}
        </p>
      </div>
    </Link>
  );
});
