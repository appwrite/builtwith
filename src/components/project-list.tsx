import { Link } from "@tanstack/react-router";
import type { Project } from "~/lib/types";
import ProjectCard from "./project-card";

export default function ProjectList({
  projects,
  href,
}: {
  projects: Project[];
  href?: string;
}) {
  return (
    <div className="project-list u-gap-16">
      {projects.slice(0, 3).map((project) => (
        <ProjectCard key={project.$id} project={project} />
      ))}

      {projects.length === 0 && (
        <article className="is-only-mobile card u-grid u-cross-center u-min-width-100-percent u-flex-shrink-0 common-section">
          <div className="u-flex u-flex-vertical u-cross-center u-gap-24">
            <div className="u-text-center">
              <h2 className="heading-level-7 u-trim-1">
                <span className="text u-margin-block-start-8">
                  No Projects Found.
                </span>
              </h2>
              <p className="text u-margin-block-start-8">
                It&apos;s your time to shine!
              </p>
            </div>
            <div className="u-flex u-gap-16 u-main-center">
              <Link to="/submit-project" className="button is-secondary">
                <span className="text">Submit Project</span>
              </Link>
            </div>
          </div>
        </article>
      )}

      {projects.length >= 1 && href && (
        <Link
          to={href}
          className="is-only-mobile button is-secondary u-width-full-line u-text-center"
        >
          <span className="text u-width-full-line">See More</span>
        </Link>
      )}
    </div>
  );
}
