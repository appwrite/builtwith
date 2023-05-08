import { component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(
  (props: { id: string; name: string; image: string }) => {
    const nav = useNavigate();

    return (
      <button onClick$={async () => await nav("/search?service=" + props.id)}>
        <div
          class="card u-flex-vertical u-cross-center u-main-center"
          style="padding: 0px;"
        >
          <div class="object-square">
            <img
              style="border-radius: var(--border-radius-medium); border-bottom-left-radius: 0px !important; border-bottom-right-radius: 0px !important;"
              src={props.image}
              alt="Service"
            />
          </div>

          <div style="padding: var(--p-card-padding)">
            <p class="u-text-center eyebrow-heading-3">{props.name}</p>
          </div>
        </div>
      </button>
    );
  }
);
