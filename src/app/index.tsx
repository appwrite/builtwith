import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ServerAppwrite } from "~/lib/appwrite-server";
import Group from "~/components/group";
import ProjectFeatured from "~/components/project-featured";
import ProjectList from "~/components/project-list";
import ServiceList from "~/components/service-list";
import TagList from "~/components/tag-list";
import { SITE_URL } from "~/lib/site";

const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const Q = ServerAppwrite.Query;
  const [
    featured,
    newAndShiny,
    trendZone,
    madeWithTailwind,
    demoAppsTotal,
    startersTotal,
    saasTotal,
    othersTotal,
  ] = await Promise.all([
    ServerAppwrite.listProjects([Q.equal("isFeatured", true), Q.limit(1)]),
    ServerAppwrite.listProjects([Q.limit(3)]),
    ServerAppwrite.listProjects([Q.orderDesc("upvotes"), Q.limit(3)]),
    ServerAppwrite.listProjects([Q.equal("uiLibrary", "tailwind"), Q.limit(3)]),
    ServerAppwrite.countProjects([Q.equal("useCase", "demo-app")]),
    ServerAppwrite.countProjects([Q.equal("useCase", "starter")]),
    ServerAppwrite.countProjects([Q.equal("useCase", "saas")]),
    ServerAppwrite.countProjects([Q.equal("useCase", "other")]),
  ]);

  return {
    featured,
    newAndShiny,
    trendZone,
    madeWithTailwind,
    totals: {
      "demo-app": demoAppsTotal,
      starter: startersTotal,
      saas: saasTotal,
      other: othersTotal,
    },
  };
});

export const Route = createFileRoute("/")({
  loader: () => getHomeData(),
  head: () => ({
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: HomePage,
});

function HomePage() {
  const {
    featured,
    newAndShiny,
    trendZone,
    madeWithTailwind,
    totals,
  } = Route.useLoaderData();

  return (
    <div className="u-flex-vertical u-gap-32 u-margin-block-start-16">
      <h1 className="heading-level-1">Built with Appwrite</h1>

      {featured[0] && (
        <Group title="Loved by Appwrite">
          <ProjectFeatured project={featured[0]} />
        </Group>
      )}

      <Group title="New" href="/search?sort=latest">
        <ProjectList projects={newAndShiny} href="/search?sort=latest" />
      </Group>

      <Group title="Trending" href="/search?sort=upvotes">
        <ProjectList projects={trendZone} href="/search?sort=upvotes" />
      </Group>

      <Group title="Services">
        <ServiceList />
      </Group>

      <Group title="Made with Tailwind" href="/search?uiLibrary=tailwind">
        <ProjectList
          projects={madeWithTailwind}
          href="/search?uiLibrary=tailwind"
        />
      </Group>

      <Group title="Use Cases">
        <TagList totals={totals} />
      </Group>
    </div>
  );
}
