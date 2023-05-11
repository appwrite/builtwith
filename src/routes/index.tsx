import { component$ } from "@builder.io/qwik";
import ProjectFeatured from "~/components/layout/ProjectFeatured";
import Group from "~/components/layout/Group";
import ProjectList from "~/components/layout/ProjectList";
import ServiceList from "~/components/layout/ServiceList";
import TagList from "~/components/layout/TagList";
import { routeLoader$ } from "@builder.io/qwik-city";
import { AppwriteService } from "~/AppwriteService";
import { Query } from "appwrite";

export const useHomeData = routeLoader$(async () => {
  const [
    featured,
    newAndShiny,
    trendZone,
    madeWithSvelteKit,
    rockWithDemoApps,
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
      Query.equal("framework", "svelte-kit"),
      Query.limit(3),
    ]),
    AppwriteService.listProjects([
      Query.equal("useCase", "demo-app"),
      Query.limit(3),
    ]),
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
    AppwriteService.listProjects([
      Query.orderAsc("randomness"),
      Query.limit(3),
    ]),
  ]);

  return {
    featured: featured[0] ?? null,
    newAndShiny,
    trendZone,
    madeWithSvelteKit,
    rockWithDemoApps,
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

        <Group
          title="Made with Svelte Kit"
          href={`/search?framework=svelte-kit`}
        >
          <ProjectList
            href={`/search?framework=svelte-kit`}
            projects={homeData.madeWithSvelteKit}
          />
        </Group>

        <Group title="Based on Services">
          <ServiceList />
        </Group>

        <Group title="Rock with Demo Apps" href={`/search?useCase=demo-app`}>
          <ProjectList
            href={`/search?useCase=demo-app`}
            projects={homeData.rockWithDemoApps}
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
      </div>
    </>
  );
});
