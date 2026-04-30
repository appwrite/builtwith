import Link from "next/link";
import { ServerAppwrite } from "~/lib/appwrite-server";
import { buildSearchQueries, titleFromParams, type SearchParams } from "~/lib/queries";
import Group from "~/components/group";
import ProjectFeatured from "~/components/project-featured";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const queries = buildSearchQueries(searchParams);
  const projects = await ServerAppwrite.listProjects(queries);
  const title = titleFromParams(searchParams);

  return (
    <div className="u-flex-vertical u-gap-32">
      <Group title={title}>
        <div className="u-flex-vertical u-gap-32">
          {projects.length === 0 && (
            <article className="card u-grid u-cross-center u-min-width-100-percent u-flex-shrink-0 common-section">
              <div className="u-flex u-flex-vertical u-cross-center u-gap-24">
                <div className="u-text-center">
                  <h2 className="heading-level-7 u-trim-1">
                    <span className="text u-margin-block-start-8">
                      No Projects Found.
                    </span>
                  </h2>
                  <p className="text u-margin-block-start-8">
                    It&apos;s your time to shine!
                  </p>
                </div>
                <div className="u-flex u-gap-16 u-main-center">
                  <Link href="/submit-project" className="button is-secondary">
                    <span className="text">Submit Project</span>
                  </Link>
                </div>
              </div>
            </article>
          )}

          {projects.map((project, index) => (
            <ProjectFeatured
              key={project.$id}
              project={project}
              lazy={index > 1}
            />
          ))}
        </div>
      </Group>
    </div>
  );
}
