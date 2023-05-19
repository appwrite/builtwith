import { Slot, component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

export default component$((props: { id: string; name: string }) => {
  const nav = useNavigate();

  return (
    <button
      class="card u-flex-vertical u-cross-center u-main-space u-overflow-hidden"
      style="padding: 0px; width: 100%;"
      onClick$={async () => await nav("/search?service=" + props.id)}
    >
      <div class="c-service-container u-stretch">
        <Slot />
      </div>

      <div style="padding: var(--p-card-padding)">
        <p class="u-text-center heading-level-5" style="font-size: 1.1rem;">
          {props.name}
        </p>
      </div>
    </button>
  );
});
