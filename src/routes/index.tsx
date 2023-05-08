import {
  $,
  component$,
  useContext,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import ProjectFeatured from "~/components/layout/ProjectFeatured";
import Group from "~/components/layout/Group";
import ProjectList from "~/components/layout/ProjectList";
import ServiceList from "~/components/layout/ServiceList";
import TagList from "~/components/layout/TagList";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { Project } from "~/AppwriteService";
import { AppwriteService } from "~/AppwriteService";
import { Query } from "appwrite";
import { UpvotesContext } from "./layout";

export const useHomeData = routeLoader$(async () => {
  const [
    featured,
    newAndShiny,
    trendZone,
    madeWithReact,
    rockWithStarterTemplates,
    madeWithTailwind,
    demoAppsTotal,
    startersTotal,
    docsTotal,
    othersTotal,
    dailySurprise,
  ] = await Promise.all([
    AppwriteService.listProjects([
      Query.equal("isFeatured", true),
      Query.limit(1),
    ]),
    AppwriteService.listProjects([
      Query.limit(3), // order applied automatically
    ]),
    AppwriteService.listProjects([Query.orderDesc("upvotes"), Query.limit(3)]),
    AppwriteService.listProjects([
      Query.equal("framework", "react"),
      Query.limit(3),
    ]),
    AppwriteService.listProjects([
      Query.equal("useCase", "starter"),
      Query.limit(3),
    ]),
    AppwriteService.listProjects([
      Query.equal("uiLibrary", "tailwind"),
      Query.limit(3),
    ]),
    AppwriteService.countProjects([
      Query.equal("useCase", "demoApp"),
      Query.limit(1),
    ]),
    AppwriteService.countProjects([
      Query.equal("useCase", "starter"),
      Query.limit(1),
    ]),
    AppwriteService.countProjects([
      Query.equal("useCase", "documentation"),
      Query.limit(1),
    ]),
    AppwriteService.countProjects([
      Query.equal("useCase", "other"),
      Query.limit(1),
    ]),
    AppwriteService.listProjects([
      Query.orderDesc("randomness"),
      Query.limit(3),
    ]),
  ]);

  return {
    featured: featured[0] ?? null,
    newAndShiny,
    trendZone,
    madeWithReact,
    rockWithStarterTemplates,
    madeWithTailwind,
    demoAppsTotal,
    startersTotal,
    docsTotal,
    othersTotal,
    dailySurprise,
    trackSync: Date.now(),
  };
});

export default component$(() => {
  const homeDataSignal = useHomeData();
  const homeData = homeDataSignal.value;

  const upvoteContext = useContext(UpvotesContext);

  const seenRecently = useSignal<Project[] | null>(null);
  const yourPicks = useSignal<Project[] | null>(null);

  const fetchSeenRecently = $(async () => {
    const seenRecentlyIds = JSON.parse(
      localStorage.getItem("seenRecently") ?? "[]"
    );
    if (seenRecentlyIds.length <= 0) {
      seenRecently.value = [];
      return;
    }

    seenRecently.value = await AppwriteService.listProjects([
      Query.equal("$id", seenRecentlyIds),
      Query.limit(3),
    ]);
  });

  const yourPickIds = useSignal<string[] | null>([]);

  const fetchYourPicks = $(async () => {
    if (yourPickIds.value === null || yourPickIds.value.length <= 0) {
      const upvotes = upvoteContext.value;
      yourPickIds.value = upvotes.map((upvote) => upvote.projectId);
    }

    if (yourPickIds.value && yourPickIds.value.length > 0) {
      yourPicks.value = await AppwriteService.listProjects([
        Query.equal("$id", yourPickIds.value.slice(0, 3)),
        Query.limit(3),
      ]);
    } else {
      yourPicks.value = [];
    }
  });

  useVisibleTask$(async ({ track }) => {
    track(() => homeData);

    await Promise.all([fetchSeenRecently(), fetchYourPicks()]);
  });

  return (
    <>
      <div class="u-flex-vertical u-gap-32">
        {homeData.featured && (
          <Group title="Loved by Appwrite">
            <ProjectFeatured project={homeData.featured}></ProjectFeatured>
          </Group>
        )}

        <Group title="New and Shiny" href={`/search?sort=latest`}>
          <ProjectList
            href={`/search?sort=latest`}
            projects={homeData.newAndShiny}
          />
        </Group>

        <Group title="Trend Zone" href={`/search?sort=upvotes`}>
          <ProjectList
            href={`/search?sort=upvotes`}
            projects={homeData.trendZone}
          />
        </Group>

        <Group title="Daily Surprise" href={`/search?sort=randomness`}>
          <ProjectList
            href={`/search?sort=randomness`}
            projects={homeData.dailySurprise}
          />
        </Group>

        <Group title="Made with React" href={`/search?framework=react`}>
          <ProjectList
            href={`/search?framework=react`}
            projects={homeData.madeWithReact}
          />
        </Group>

        <Group title="Based on Services">
          <ServiceList />
        </Group>

        <Group
          title="Rock with Starter Templates"
          href={`/search?useCase=starter`}
        >
          <ProjectList
            href={`/search?useCase=starter`}
            projects={homeData.rockWithStarterTemplates}
          />
        </Group>

        <Group title="Made with Tailwind" href={`/search?uiLibrary=tailwind`}>
          <ProjectList
            href={`/search?uiLibrary=tailwind`}
            projects={homeData.madeWithTailwind}
          />
        </Group>

        <Group title="Common Use Cases">
          <TagList
            startersTotal={homeData.startersTotal}
            demoAppsTotal={homeData.demoAppsTotal}
            othersTotal={homeData.othersTotal}
            docsTotal={homeData.docsTotal}
          />
        </Group>

        {yourPicks.value !== null && (
          <Group title="Your Picks">
            <ProjectList projects={yourPicks.value} />
          </Group>
        )}

        {seenRecently.value !== null && (
          <Group title="Seen Recently" href={`/search?filter=seenRecently`}>
            <ProjectList
              href={`/search?filter=seenRecently`}
              projects={seenRecently.value}
            />
          </Group>
        )}
      </div>
    </>
  );
});
