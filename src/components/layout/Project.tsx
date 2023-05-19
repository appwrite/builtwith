import { component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { Project } from "~/AppwriteService";
import { AppwriteService } from "~/AppwriteService";
import Upvote from "../blocks/Upvote";
import ProjectTags from "./ProjectTags";

export default component$((props: { project: Project | null }) => {
  const { project } = props;
  const nav = useNavigate();

  return project === null ? (
    <div
      class="is-not-mobile card c-empty-card is-border-dashed u-flex-vertical u-cross-center u-main-center"
      style="padding: 0px; height: 100%;"
    >
      <div
        class="u-flex u-cross-center u-main-center"
        style="padding: var(--p-card-padding); width: 100%; height: 100%;"
      >
        <div
          class="u-flex u-cross-center u-main-space-between"
          style="width: 100%;"
        >
          <div
            style="width: 100%;"
            class="u-flex-vertical u-gap-12 u-main-center u-cross-center"
          >
            <button
              onClick$={async () => await nav("/submit-project")}
              class="button is-secondary"
            >
              <span class="text">Submit Project</span>
            </button>
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
      <div style="padding: var(--p-card-padding); width: 100%;">
        <div
          class="u-flex u-cross-center u-gap-8 u-main-space-between"
          style="width: 100%;"
        >
          <div class="u-stretch u-flex-vertical u-gap-16">
            <div class="u-flex u-main-space-between u-cross-center">
              <p
                class="heading-level-4 c-trim u-cursor-pointer "
                style="font-size: 1.3rem;"
                onClick$={async () => await nav(`/projects/${project.$id}`)}
              >
                {project.name}
              </p>
              <Upvote projectId={project.$id} votes={project.upvotes} inline />
            </div>
            <p
              class="u-margin-block-start-4 c-trim-2 u-cursor-pointer "
              style="min-height: 3em;"
              onClick$={async () => await nav(`/projects/${project.$id}`)}
            >
              {project.tagline}
            </p>
          </div>
        </div>
      </div>

      <div
        class="object-og u-cursor-pointer"
        style="height: 200px;"
        onClick$={async () => await nav(`/projects/${project.$id}`)}
      >
        <img src={AppwriteService.getProjectThumbnail(project.imageId)} />
      </div>

      <div
        class="u-flex u-cross-center u-gap-8 u-flex-wrap"
        style="padding: var(--p-card-padding); width: 100%; margin-top: auto;"
      >
        <ProjectTags project={project} />
      </div>
    </div>
  );
});
