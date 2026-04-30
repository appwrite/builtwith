import Link from "next/link";
import { ServerAppwrite } from "~/lib/appwrite-server";
import type { Project } from "~/lib/types";
import ProjectTags from "./project-tags";
import Upvote from "./upvote";

export default function ProjectCard({ project }: { project: Project | null }) {
  if (!project) {
    return (
      <div
        className="is-not-mobile card c-empty-card is-border-dashed u-flex-vertical u-cross-center u-main-center"
        style={{ padding: 0, height: "100%" }}
      >
        <div
          className="u-flex u-cross-center u-main-center u-width-full-line"
          style={{ padding: "var(--p-card-padding)", height: "100%" }}
        >
          <Link href="/submit-project" className="button is-secondary">
            <span className="text">Submit Project</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card u-flex-vertical u-cross-center u-main-center"
      style={{ padding: 0, height: "100%" }}
    >
      <div
        className="u-width-full-line"
        style={{ padding: "var(--p-card-padding)" }}
      >
        <div className="u-flex u-cross-center u-gap-8 u-main-space-between u-width-full-line">
          <div className="u-stretch u-flex-vertical u-gap-16">
            <div className="u-flex u-main-space-between u-cross-center u-gap-8">
              <Link href={`/projects/${project.$id}`}>
                <p
                  className="heading-level-4 c-trim"
                  style={{ fontSize: "1.3rem" }}
                >
                  {project.name}
                </p>
              </Link>
              <Upvote projectId={project.$id} votes={project.upvotes} />
            </div>
            <Link href={`/projects/${project.$id}`}>
              <p
                className="u-margin-block-start-4 c-trim-2"
                style={{ minHeight: "3em" }}
              >
                {project.tagline}
              </p>
            </Link>
          </div>
        </div>
      </div>

      <Link className="object-og" href={`/projects/${project.$id}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ServerAppwrite.thumbnailUrl(project.imageId)}
          width={1280}
          height={720}
          alt=""
        />
      </Link>

      <div
        className="u-flex u-main-start u-cross-start u-gap-4 u-flex-wrap u-stretch u-width-full-line"
        style={{
          padding: "var(--p-card-padding)",
          alignContent: "flex-start",
        }}
      >
        <ProjectTags project={project} />
      </div>
    </div>
  );
}
