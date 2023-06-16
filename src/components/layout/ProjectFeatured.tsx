import { component$ } from "@builder.io/qwik";
import Upvote from "../blocks/Upvote";
import { AppwriteService, type Project } from "~/AppwriteService";
import { Link } from "@builder.io/qwik-city";
import ProjectTags from "./ProjectTags";

export default component$((props: { project: Project }) => {
  const { project } = props;

  return (
    <article class="card u-min-width-100-percent">
      <div class="u-flex u-flex-vertical-mobile u-gap-24">
        <div class="u-flex-basis-50-percent u-flex-shrink-0">
          <Link
            href={`/projects/${project.$id}`}
            class="object-og object-og-rounded"
          >
            <img
              src={AppwriteService.getProjectThumbnail(project.imageId, 1920)}
            />
          </Link>
        </div>

        <div class="u-flex u-flex-vertical u-stretch u-gap-8">
          <div class="u-flex u-main-space-between u-cross-center u-gap-8">
            <Link
              href={`/projects/${project.$id}`}
              class="heading-level-3 u-margin-block-start-12 c-trim"
            >
              {project.name}
            </Link>
            <Upvote projectId={project.$id} votes={project.upvotes} />
          </div>

          <div class="u-stretch">
            <p class="u-margin-block-start-4 c-trim-2" style="font-size: 1rem;">
              {project.tagline}
            </p>
          </div>

          <div class="u-flex u-cross-center u-gap-8 u-flex-wrap u-margin-block-start-12">
            <ProjectTags project={project} />
          </div>
        </div>
      </div>
    </article>
  );
});
