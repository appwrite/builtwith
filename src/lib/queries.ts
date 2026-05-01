import { Query } from "appwrite";

// Match router search param runtime shape: a key can be string, string[]
// (duplicate keys), or undefined. Treat string[] as a comma-joined value.
export type RawSearchParams = Record<
  string,
  string | string[] | undefined
>;

const first = (
  v: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(v)) return v.join(",");
  return v;
};

export const buildSearchQueries = (
  raw: RawSearchParams,
  limit = 20,
  cursorAfter?: string
): string[] => {
  const queries: string[] = [Query.limit(limit)];

  if (cursorAfter) {
    queries.push(Query.cursorAfter(cursorAfter));
  }

  const framework = first(raw.framework);
  const platform = first(raw.platform);
  const uiLibrary = first(raw.uiLibrary);
  const useCase = first(raw.useCase);
  const service = first(raw.service);
  const sort = first(raw.sort);

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
    for (const s of service.split(",")) {
      if (s === "authentication") {
        queries.push(Query.equal("hasAuthentication", true));
      } else if (s === "messaging") {
        queries.push(Query.equal("hasMessaging", true));
      } else if (s === "storage") {
        queries.push(Query.equal("hasStorage", true));
      } else if (s === "realtime") {
        queries.push(Query.equal("hasRealtime", true));
      } else if (s === "functions") {
        queries.push(Query.equal("hasFunctions", true));
      } else if (s === "databases") {
        queries.push(Query.equal("hasDatabases", true));
      }
    }
  }

  if (sort === "latest") {
    queries.push(Query.orderDesc("$createdAt"));
  } else if (sort === "upvotes") {
    queries.push(Query.orderDesc("upvotes"));
  }

  return queries;
};

export const titleFromParams = (raw: RawSearchParams) => {
  const framework = first(raw.framework);
  const platform = first(raw.platform);
  const uiLibrary = first(raw.uiLibrary);
  const useCase = first(raw.useCase);
  const service = first(raw.service);

  if (framework) return `Made with ${framework}`;
  if (platform) return `Built for ${platform}`;
  if (uiLibrary) return `Designed with ${uiLibrary}`;
  if (useCase) return `${useCase} projects`;
  if (service) return `Using ${service}`;
  return "Search Results";
};
