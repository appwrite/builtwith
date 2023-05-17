import { component$ } from "@builder.io/qwik";
import Upvote from "../blocks/Upvote";
import { AppwriteService, type Project } from "~/AppwriteService";
import { useNavigate } from "@builder.io/qwik-city";
import ProjectTags from "./ProjectTags";

export default component$((props: { project: Project }) => {
  const nav = useNavigate();
  const { project } = props;

  return (
    <article class="card u-grid u-cross-center u-min-width-100-percent u-flex-shrink-0">
      <div
        class="u-flex u-flex-vertical-mobile u-gap-24"
        style="min-height: 100%;"
      >
        <button
          onClick$={async () => await nav(`/projects/${project.$id}`)}
          class="object-og u-flex-basis-50-percent u-flex-shrink-0"
        >
          <img
            src={AppwriteService.getProjectThumbnail(project.imageId, 1920)}
            style="border-radius: var(--border-radius-medium);"
          />
        </button>

        <div
          class="u-flex-basis-50-percent u-flex u-flex-vertical u-main-space-between"
          style="min-height: 100%;"
        >
          <div class="u-flex-vertical u-gap-8">
            <div class="u-flex u-main-space-between u-cross-center">
              <button
                onClick$={async () => await nav(`/projects/${project.$id}`)}
                class="heading-level-3 u-trim u-margin-block-start-12 c-trim"
              >
                {project.name}
              </button>
              <Upvote
                projectId={project.$id}
                inline={true}
                votes={project.upvotes}
              />
            </div>

            <p class="u-margin-block-start-4 c-trim-2" style="font-size: 1rem;">
              {project.tagline}
            </p>
          </div>

          <div class=" u-flex u-cross-center u-gap-8 u-flex-wrap u-margin-block-start-12">
            <ProjectTags project={project} />
          </div>
        </div>
      </div>
    </article>
  );
});
