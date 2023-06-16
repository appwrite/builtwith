import {
  component$,
  useComputed$,
  useContext,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import ProjectFeatured from "~/components/layout/ProjectFeatured";
import Group from "~/components/layout/Group";
import ProjectList from "~/components/layout/ProjectList";
import ServiceList from "~/components/layout/ServiceList";
import TagList from "~/components/layout/TagList";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { Project } from "~/AppwriteService";
import { AppwriteService } from "~/AppwriteService";
import { Query } from "appwrite";
import { AccountContext } from "./layout";
import { useUpvotes } from "~/components/hooks/useUpvotes";

export const useHomeData = routeLoader$(async () => {
  const [
    featured,
    newAndShiny,
    trendZone,
    madeWithTailwind,
    demoAppsTotal,
    startersTotal,
    docsTotal,
    othersTotal,
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
      Query.equal("uiLibrary", "tailwind"),
      Query.limit(3),
    ]),
    AppwriteService.countProjects([
      Query.equal("useCase", "demo-app"),
      Query.limit(1),
    ]),
    AppwriteService.countProjects([
      Query.equal("useCase", "starter"),
      Query.limit(1),
    ]),
    AppwriteService.countProjects([
      Query.equal("useCase", "saas"),
      Query.limit(1),
    ]),
    AppwriteService.countProjects([
      Query.equal("useCase", "other"),
      Query.limit(1),
    ]),
  ]);

  return {
    featured: featured[0] ?? null,
    newAndShiny,
    trendZone,
    madeWithTailwind,
    demoAppsTotal,
    startersTotal,
    docsTotal,
    othersTotal,
    trackSync: Date.now(),
  };
});

export const head: DocumentHead = () => ({
  title: "Built with Appwrite",
  meta: [
    {
      name: "description",
      content: "Explore popular projects built with Appwrite.",
    },
    {
      name: "og:title",
      content: "Built with Appwrite",
    },
    {
      name: "og:description",
      content: "Explore popular projects built with Appwrite.",
    },
  ],
});

export default component$(() => {
  const account = useContext(AccountContext);
  const homeDataSignal = useHomeData();
  const homeData = homeDataSignal.value;

  const allProjects = useComputed$(() => [
    ...(homeData.featured ? [homeData.featured] : []),
    ...(homeData.newAndShiny ?? []),
    ...(homeData.trendZone ?? []),
    ...(homeData.madeWithTailwind ?? []),
    ...(yourPicks.value ?? []),
    ...(recentlyVisited.value ?? []),
  ]);
  const projectIds = useComputed$(() =>
    allProjects.value.map((project) => project.$id)
  );
  useUpvotes(projectIds);

  useVisibleTask$(async () => {
    account.value = await AppwriteService.getAccount();
  });

  const yourPicks = useSignal<Project[] | undefined>([]);
  useVisibleTask$(async () => {
    if (!account.value) return;

    const lastUpvotes = await AppwriteService.listUserUpvotes(
      account.value.$id,
      [Query.limit(3)]
    );

    if (lastUpvotes.length === 0) return;

    yourPicks.value = await AppwriteService.listProjects([
      Query.equal(
        "$id",
        lastUpvotes.map((upvote) => upvote.projectId)
      ),
    ]);
  });

  const recentlyVisited = useSignal<Project[] | undefined>([]);
  useVisibleTask$(async () => {
    const visitedProjects = JSON.parse(
      localStorage.getItem("visitedProjects") ?? "[]"
    ) as string[];
    if (visitedProjects.length === 0) return;

    recentlyVisited.value = await AppwriteService.listProjects([
      Query.equal("$id", visitedProjects.slice(0, 3)),
    ]);
  });

  return (
    <>
      <div class="u-flex-vertical u-gap-32 u-margin-block-start-16">
        <h1 class="heading-level-1">Built with Appwrite</h1>
        {homeData.featured && (
          <Group title="Loved by Appwrite">
            <ProjectFeatured project={homeData.featured}></ProjectFeatured>
          </Group>
        )}

        <Group title="New" href={`/search?sort=latest`}>
          <ProjectList
            href={`/search?sort=latest`}
            projects={homeData.newAndShiny}
          />
        </Group>

        <Group title="Trending" href={`/search?sort=upvotes`}>
          <ProjectList
            href={`/search?sort=upvotes`}
            projects={homeData.trendZone}
          />
        </Group>

        <Group title="Services">
          <ServiceList />
        </Group>

        <Group title="Made with Tailwind" href={`/search?uiLibrary=tailwind`}>
          <ProjectList
            href={`/search?uiLibrary=tailwind`}
            projects={homeData.madeWithTailwind}
          />
        </Group>

        <Group title="Use Cases">
          <TagList
            startersTotal={homeData.startersTotal ?? 0}
            demoAppsTotal={homeData.demoAppsTotal ?? 0}
            othersTotal={homeData.othersTotal ?? 0}
            docsTotal={homeData.docsTotal ?? 0}
          />
        </Group>

        {yourPicks.value && yourPicks.value.length > 0 && (
          <Group title="Your Picks">
            <ProjectList projects={yourPicks.value} />
          </Group>
        )}

        {recentlyVisited.value && recentlyVisited.value.length > 0 && (
          <Group title="Recently Visited">
            <ProjectList projects={recentlyVisited.value} />
          </Group>
        )}
      </div>
    </>
  );
});
