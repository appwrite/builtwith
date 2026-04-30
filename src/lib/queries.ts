import { Query } from "node-appwrite";

export type SearchParams = {
  framework?: string;
  uiLibrary?: string;
  useCase?: string;
  service?: string;
  platform?: string;
  sort?: string;
};

export const buildSearchQueries = (
  params: SearchParams,
  limit = 20,
  cursorAfter?: string
): string[] => {
  const queries: string[] = [Query.limit(limit)];

  if (cursorAfter) {
    queries.push(Query.cursorAfter(cursorAfter));
  }

  if (params.framework) {
    queries.push(Query.equal("framework", params.framework.split(",")));
  }
  if (params.platform) {
    queries.push(Query.equal("platform", params.platform.split(",")));
  }
  if (params.uiLibrary) {
    queries.push(Query.equal("uiLibrary", params.uiLibrary.split(",")));
  }
  if (params.useCase) {
    queries.push(Query.equal("useCase", params.useCase.split(",")));
  }

  if (params.service) {
    for (const service of params.service.split(",")) {
      if (service === "authentication") {
        queries.push(Query.equal("hasAuthentication", true));
      } else if (service === "messaging") {
        queries.push(Query.equal("hasMessaging", true));
      } else if (service === "storage") {
        queries.push(Query.equal("hasStorage", true));
      } else if (service === "realtime") {
        queries.push(Query.equal("hasRealtime", true));
      } else if (service === "functions") {
        queries.push(Query.equal("hasFunctions", true));
      } else if (service === "databases") {
        queries.push(Query.equal("hasDatabases", true));
      }
    }
  }

  if (params.sort === "latest") {
    queries.push(Query.orderDesc("$createdAt"));
  } else if (params.sort === "upvotes") {
    queries.push(Query.orderDesc("upvotes"));
  }

  return queries;
};

export const titleFromParams = (params: SearchParams) => {
  if (params.framework) return `Made with ${params.framework}`;
  if (params.platform) return `Built for ${params.platform}`;
  if (params.uiLibrary) return `Designed with ${params.uiLibrary}`;
  if (params.useCase) return `${params.useCase} projects`;
  if (params.service) return `Using ${params.service}`;
  return "Search Results";
};
