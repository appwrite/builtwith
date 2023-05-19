import { component$ } from "@builder.io/qwik";
import Project from "./Project";
import type { Project as ProjectType } from "~/AppwriteService";
import { useNavigate } from "@builder.io/qwik-city";

export default component$(
  (props: { href?: string; projects: ProjectType[] }) => {
    const nav = useNavigate();

    const project1 = props.projects[0] ?? null;
    const project2 = props.projects[1] ?? null;
    const project3 = props.projects[2] ?? null;

    return (
      <div class="project-list u-gap-16">
        <div style="flex-basis: calc(33.33% - 1rem)">
          <Project project={project1} />
        </div>
        <div style="flex-basis: calc(33.33% - 1rem)">
          <Project project={project2} />
        </div>
        <div style="flex-basis: calc(33.33% - 1rem)">
          <Project project={project3} />
        </div>

        {props.projects.length === 0 && (
          <article class="is-only-mobile card u-grid u-cross-center u-min-width-100-percent u-flex-shrink-0 common-section">
            <div class="u-flex u-flex-vertical u-cross-center u-gap-24">
              <div class="u-text-center">
                <h2 class="heading-level-7 u-trim-1">
                  <p class="text u-margin-block-start-8">No Projects Found.</p>
                </h2>
                <p class="body-text-2 u-margin-block-start-4"></p>
                <p class="text u-margin-block-start-8">
                  It's your time to shine!
                </p>
              </div>
              <div class="u-flex u-gap-16 u-main-center">
                <button
                  onClick$={async () => await nav("/submit-project")}
                  class="button is-secondary"
                  type="button"
                >
                  <span class="text">Submit Project</span>
                </button>
              </div>
            </div>
          </article>
        )}

        {props.projects.length >= 1 && props.href && (
          <button
            onClick$={async () => await nav(props.href)}
            class="is-only-mobile button is-secondary u-width-full-line u-text-center"
            type="button"
          >
            <span class="text u-width-full-line">See More</span>
          </button>
        )}
      </div>
    );
  }
);
