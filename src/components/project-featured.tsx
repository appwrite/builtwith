import Link from "next/link";
import { ServerAppwrite } from "~/lib/appwrite-server";
import type { Project } from "~/lib/types";
import ProjectTags from "./project-tags";
import Upvote from "./upvote";

export default function ProjectFeatured({
  project,
  lazy = false,
}: {
  project: Project;
  lazy?: boolean;
}) {
  return (
    <article className="card u-min-width-100-percent project-card-virtual">
      <div className="u-flex u-flex-vertical-mobile u-gap-24">
        <div className="u-flex-basis-50-percent u-flex-shrink-0">
          <Link
            href={`/projects/${project.$id}`}
            className="object-og object-og-rounded"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ServerAppwrite.thumbnailUrl(project.imageId, 1280)}
              loading={lazy ? "lazy" : "eager"}
              decoding="async"
              fetchPriority={lazy ? "low" : "high"}
              width={1280}
              height={720}
              alt=""
            />
          </Link>
        </div>

        <div className="u-flex u-flex-vertical u-stretch u-gap-8">
          <div className="u-flex u-main-space-between u-cross-center u-gap-8">
            <Link
              href={`/projects/${project.$id}`}
              className="heading-level-3 u-margin-block-start-12 c-trim"
            >
              {project.name}
            </Link>
            <Upvote projectId={project.$id} votes={project.upvotes} />
          </div>

          <div className="u-stretch">
            <p
              className="u-margin-block-start-4 c-trim-2"
              style={{ fontSize: "1rem" }}
            >
              {project.tagline}
            </p>
          </div>

          <div className="u-flex u-cross-center u-gap-8 u-flex-wrap u-margin-block-start-12">
            <ProjectTags project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}
