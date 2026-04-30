import { ServerAppwrite } from "~/lib/appwrite-server";
import Group from "~/components/group";
import ProjectFeatured from "~/components/project-featured";
import ProjectList from "~/components/project-list";
import ServiceList from "~/components/service-list";
import TagList from "~/components/tag-list";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
        <TagList
          totals={{
            "demo-app": demoAppsTotal,
            starter: startersTotal,
            saas: saasTotal,
            other: othersTotal,
          }}
        />
      </Group>
    </div>
  );
}
