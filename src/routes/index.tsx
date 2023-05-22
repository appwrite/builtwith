import {
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
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import type { Project } from "~/AppwriteService";
import { AppwriteService } from "~/AppwriteService";
import { Query } from "appwrite";
import { AccountContext } from "./layout";
import { UpvotesContext } from "./layout";

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
  const upvotes = useContext(UpvotesContext);
  const homeDataSignal = useHomeData();
  const homeData = homeDataSignal.value;

  const yourPicks = useSignal<Project[] | undefined>([]);

  useVisibleTask$(async () => {
    if (!account || upvotes.value.length < 3) return;
    yourPicks.value = await Promise.all([
      AppwriteService.getProject(upvotes.value[0].projectId),
      AppwriteService.getProject(upvotes.value[1].projectId),
      AppwriteService.getProject(upvotes.value[2].projectId),
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
            startersTotal={homeData.startersTotal}
            demoAppsTotal={homeData.demoAppsTotal}
            othersTotal={homeData.othersTotal}
            docsTotal={homeData.docsTotal}
          />
        </Group>

        {account.value && yourPicks.value && (
          <Group title="Your Picks">
            <ProjectList projects={yourPicks.value} />
          </Group>
        )}
      </div>
    </>
  );
});
