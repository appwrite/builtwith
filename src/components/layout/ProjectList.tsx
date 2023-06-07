import { component$ } from "@builder.io/qwik";
import Project from "./Project";
import type { Project as ProjectType } from "~/AppwriteService";
import { Link } from "@builder.io/qwik-city";

export default component$(
  (props: { href?: string; projects: ProjectType[] }) => {
    return (
      <div class="project-list u-gap-16">
        {props.projects.slice(0, 3).map((project) => (
          <Project key={project.$id} project={project} />
        ))}

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
                <Link href="/submit-project" class="button is-secondary">
                  <span class="text">Submit Project</span>
                </Link>
              </div>
            </div>
          </article>
        )}

        {props.projects.length >= 1 && props.href && (
          <Link
            href={props.href}
            class="is-only-mobile button is-secondary u-width-full-line u-text-center"
          >
            <span class="text u-width-full-line">See More</span>
          </Link>
        )}
      </div>
    );
  }
);
