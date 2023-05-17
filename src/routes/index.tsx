import { component$ } from "@builder.io/qwik";
import ProjectFeatured from "~/components/layout/ProjectFeatured";
import Group from "~/components/layout/Group";
import ProjectList from "~/components/layout/ProjectList";
import ServiceList from "~/components/layout/ServiceList";
import TagList from "~/components/layout/TagList";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { AppwriteService } from "~/AppwriteService";
import { Query } from "appwrite";

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
  const homeDataSignal = useHomeData();
  const homeData = homeDataSignal.value;

  return (
    <>
      <div class="u-flex-vertical u-gap-32">
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
      </div>
    </>
  );
});
