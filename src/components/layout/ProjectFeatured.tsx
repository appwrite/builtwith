import { component$ } from "@builder.io/qwik";
import Upvote from "../blocks/Upvote";
import { AppwriteService, type Project } from "~/AppwriteService";
import { Config } from "~/Config";
import { useNavigate } from "@builder.io/qwik-city";
import TagList from "./TagList";
import ProjectTags from "./ProjectTags";

export default component$((props: { project: Project }) => {
  const nav = useNavigate();
  const { project } = props;

  const platform = (Config.platforms as any)[project.platform] ?? null;
  const useCase = (Config.useCases as any)[project.useCase] ?? null;
  const framework = (Config.frameworks as any)[project.framework ?? ""] ?? null;
  const uiLibrary =
    (Config.uiLibraries as any)[project.uiLibrary ?? ""] ?? null;

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
          <div>
            <div class="">
              <Upvote
                projectId={project.$id}
                inline={true}
                votes={project.upvotes}
              />
            </div>

            <button
              onClick$={async () => await nav(`/projects/${project.$id}`)}
              class="heading-level-3 u-trim u-margin-block-start-12 c-trim"
            >
              {project.name}
            </button>
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
