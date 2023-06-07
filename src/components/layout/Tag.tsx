import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(
  (props: { id: string; name: string; description: string; total: number }) => {
    return (
      <Link href={`/search?useCase=${props.id}`}>
        <div
          class="card u-flex-vertical u-cross-center u-main-center"
          style="padding: 0px;"
        >
          <div style="padding: var(--p-card-padding)">
            <p class="eyebrow-heading-3 c-trim">{props.name}</p>

            <p class="u-margin-block-start-4 c-trim-2">{props.description}</p>

            <button class="button is-secondary  u-margin-block-start-16">
              <span class="text">
                View {props.total} {props.total === 1 ? "Project" : "Projects"}
              </span>
            </button>
          </div>
        </div>
      </Link>
    );
  }
);
