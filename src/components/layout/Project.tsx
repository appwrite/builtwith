import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Project } from "~/AppwriteService";
import { AppwriteService } from "~/AppwriteService";
import Upvote from "../blocks/Upvote";
import ProjectTags from "./ProjectTags";

export default component$((props: { project: Project | null }) => {
  const { project } = props;

  return project === null ? (
    <div
      class="is-not-mobile card c-empty-card is-border-dashed u-flex-vertical u-cross-center u-main-center"
      style="padding: 0px; height: 100%;"
    >
      <div
        class="u-flex u-cross-center u-main-center u-width-full-line"
        style="padding: var(--p-card-padding); height: 100%;"
      >
        <div class="u-flex u-cross-center u-main-center u-width-full-line">
          <div class="u-flex-vertical u-gap-12 u-main-center u-cross-center u-width-full-line">
            <Link href="/submit-project" class="button is-secondary">
              <span class="text">Submit Project</span>
            </Link>
          </div>
        </div>
      </div>

      <div class="object-og" style="height: 200px;">
        <img class="c-dark-only" src="/images/project-placeholder.png" alt="" />
        <img
          class="c-light-only"
          src="/images/project-placeholder-light.png"
          alt=""
        />
      </div>
    </div>
  ) : (
    <div
      class="card u-flex-vertical u-cross-center u-main-center"
      style="padding: 0px; height: 100%;"
    >
      <div class="u-width-full-line" style="padding: var(--p-card-padding);">
        <div class="u-flex u-cross-center u-gap-8 u-main-space-between u-width-full-line">
          <div class="u-stretch u-flex-vertical u-gap-16">
            <div class="u-flex u-main-space-between u-cross-center u-gap-8">
              <Link href={`/projects/${project.$id}`}>
                <p class="heading-level-4 c-trim" style="font-size: 1.3rem;">
                  {project.name}
                </p>
              </Link>
              <Upvote projectId={project.$id} votes={project.upvotes} inline />
            </div>
            <Link href={`/projects/${project.$id}`}>
              <p
                class="u-margin-block-start-4 c-trim-2"
                style="min-height: 3em;"
              >
                {project.tagline}
              </p>
            </Link>
          </div>
        </div>
      </div>

      <Link class="object-og" href={`/projects/${project.$id}`}>
        <img src={AppwriteService.getProjectThumbnail(project.imageId)} />
      </Link>

      <div
        class="u-flex u-main-start u-cross-start u-gap-4 u-flex-wrap u-stretch u-width-full-line"
        style="padding: var(--p-card-padding); align-content: flex-start;"
      >
        <ProjectTags project={project} />
      </div>
    </div>
  );
});
