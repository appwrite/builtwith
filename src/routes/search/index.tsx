import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$, useLocation, useNavigate } from "@builder.io/qwik-city";
import { Query } from "appwrite";
import { AppwriteService } from "~/AppwriteService";
import Group from "~/components/layout/Group";
import ProjectFeatured from "~/components/layout/ProjectFeatured";

const generateQueries = (url: URL) => {
  const queries = [Query.limit(20)];

  const framework = url.searchParams.get("framework");
  const uiLibrary = url.searchParams.get("uiLibrary");
  const useCase = url.searchParams.get("useCase");
  const service = url.searchParams.get("service");
  const platform = url.searchParams.get("platform");

  if (framework) {
    queries.push(Query.equal("framework", framework.split(",")));
  }

  if (platform) {
    queries.push(Query.equal("platform", platform.split(",")));
  }

  if (uiLibrary) {
    queries.push(Query.equal("uiLibrary", uiLibrary.split(",")));
  }

  if (useCase) {
    queries.push(Query.equal("useCase", useCase.split(",")));
  }

  if (service) {
    const services = service.split(",");

    for (const service of services) {
      if (service === "authentication") {
        queries.push(Query.equal("hasAuthentication", true));
      }
      if (service === "storage") {
        queries.push(Query.equal("hasStorage", true));
      }
      if (service === "realtime") {
        queries.push(Query.equal("hasRealtime", true));
      }
      if (service === "functions") {
        queries.push(Query.equal("hasFunctions", true));
      }
      if (service === "databases") {
        queries.push(Query.equal("hasDatabases", true));
      }
    }
  }

  const sort = url.searchParams.get("sort");

  if (sort === "latest") {
    queries.push(Query.orderDesc("$createdAt"));
  } else if (sort === "upvotes") {
    queries.push(Query.orderDesc("upvotes"));
  }

  return queries;
};

const generateTitle = (url: URL) => {
  const framework = url.searchParams.get("framework");
  const platform = url.searchParams.get("platform");
  const uiLibrary = url.searchParams.get("uiLibrary");
  const useCase = url.searchParams.get("useCase");
  const service = url.searchParams.get("service");

  if (framework) {
    return `Made with ${framework}`;
  }

  if (platform) {
    return `Built for ${platform}`;
  }

  if (uiLibrary) {
    return `Designed with ${uiLibrary}`;
  }

  if (useCase) {
    return `${useCase} projects`;
  }

  if (service) {
    return `Using ${service}`;
  }

  return "Search";
};

export const useSearchData = routeLoader$(async ({ url }) => {
  const queries = generateQueries(url);
  const projects = await AppwriteService.listProjects(queries);

  return {
    projects,
  };
});

export const head: DocumentHead = () => ({
  title: "Search | Built with Appwrite",
  meta: [
    {
      name: "description",
      content: "Search popular projects built with Appwrite.",
    },
    {
      name: "og:title",
      content: "Search | Built with Appwrite",
    },
    {
      name: "og:description",
      content: "Search popular projects built with Appwrite.",
    },
  ],
});

export default component$(() => {
  const searchData = useSearchData();

  const nav = useNavigate();

  const projects = useSignal(searchData.value.projects);
  const location = useLocation();

  const lastId = useSignal<string | null>(
    searchData.value.projects[searchData.value.projects.length - 1]?.$id ?? null
  );
  const showPagination = useSignal(lastId.value !== null);
  const isLoading = useSignal(false);

  const title = generateTitle(location.url);

  const loadNextPage = $(async () => {
    const queries = generateQueries(location.url);

    if (!lastId.value) {
      return;
    }

    isLoading.value = true;

    try {
      queries.push(Query.cursorAfter(lastId.value));

      const nextProjects = await AppwriteService.listProjects(queries);

      const oldLength = projects.value.length;
      projects.value = [...new Set([...projects.value, ...nextProjects])];
      const newLength = projects.value.length;

      lastId.value = projects.value[projects.value.length - 1]?.$id ?? null;
      showPagination.value = oldLength !== newLength;
    } catch (err) {
      console.log(err);
    } finally {
      isLoading.value = false;
    }
  });

  useVisibleTask$(async ({ track }) => {
    track(() => searchData.value);

    projects.value = searchData.value.projects;
    lastId.value =
      searchData.value.projects[searchData.value.projects.length - 1]?.$id ??
      null;
    showPagination.value = lastId.value !== null;
    isLoading.value = false;
  });

  return (
    <>
      <div class="u-flex-vertical u-gap-32">
        <Group title={title}>
          <div class="u-flex-vertical u-gap-32">
            {projects.value.length === 0 && (
              <article class="card u-grid u-cross-center u-min-width-100-percent u-flex-shrink-0 common-section">
                <div class="u-flex u-flex-vertical u-cross-center u-gap-24">
                  <div class="u-text-center">
                    <h2 class="heading-level-7 u-trim-1">
                      <p class="text u-margin-block-start-8">
                        No Projects Found.
                      </p>
                    </h2>
                    <p class="body-text-2 u-margin-block-start-4"></p>
                    <p class="text u-margin-block-start-8">
                      It's your time to shine!
                    </p>
                  </div>
                  <div class="u-flex u-gap-16 u-main-center">
                    <button
                      onClick$={async () => await nav("/submit-project")}
                      class="button is-secondary"
                      type="button"
                    >
                      <span class="text">Submit Project</span>
                    </button>
                  </div>
                </div>
              </article>
            )}

            {projects.value.map((project) => (
              <ProjectFeatured key={project.$id} project={project} />
            ))}

            {showPagination.value && (
              <div class="u-flex u-main-center">
                <button
                  onClick$={loadNextPage}
                  class="button is-secondary u-text-center"
                  type="button"
                  style="padding: 1rem;"
                >
                  {isLoading.value ? (
                    <div class="loader"></div>
                  ) : (
                    <span class="text u-width-full-line">Load More</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </Group>
      </div>
    </>
  );
});
