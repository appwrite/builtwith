import { Client, Databases, Query } from "node-appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  type Project,
} from "./types";
import { thumbnailUrl } from "./appwrite-urls";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

const databases = new Databases(client);

const ensurePublishedAndSorted = (queries: string[]) => {
  const hasIsPublished = queries.find((q) => q.includes('"isPublished"'));
  const hasCreatedAtSort = queries.find(
    (q) =>
      q.startsWith('orderDesc("$createdAt') ||
      q.startsWith('orderAsc("$createdAt')
  );

  const final = [...queries];
  if (!hasIsPublished) final.push(Query.equal("isPublished", true));
  if (!hasCreatedAtSort) final.push(Query.orderDesc("$createdAt"));
  return final;
};

export const ServerAppwrite = {
  Query,
  listProjects: async (queries: string[] = []): Promise<Project[]> => {
    const res = await databases.listDocuments<Project>(
      "main",
      "projects",
      ensurePublishedAndSorted(queries)
    );
    return res.documents;
  },
  countProjects: async (queries: string[] = []): Promise<number> => {
    // Only the total is needed; strip any caller-supplied limit so the SDK
    // doesn't see duplicate Query.limit(...) entries, then cap at 1.
    const withoutLimit = queries.filter((q) => !q.startsWith('limit('));
    const res = await databases.listDocuments<Project>(
      "main",
      "projects",
      [...ensurePublishedAndSorted(withoutLimit), Query.limit(1)]
    );
    return res.total;
  },
  getProject: async (projectId: string): Promise<Project | null> => {
    // Use listDocuments with an isPublished filter so unpublished drafts are
    // never rendered server-side, even if a guesser hits /projects/<id>.
    try {
      const res = await databases.listDocuments<Project>("main", "projects", [
        Query.equal("$id", projectId),
        Query.equal("isPublished", true),
        Query.limit(1),
      ]);
      return res.documents[0] ?? null;
    } catch {
      return null;
    }
  },
  thumbnailUrl,
};
