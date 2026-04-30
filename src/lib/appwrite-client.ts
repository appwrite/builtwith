"use client";

import {
  Account,
  Client,
  Databases,
  Functions,
  ID,
  OAuthProvider,
  Query,
  Storage,
  type Models,
} from "appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  type Project,
  type ProjectUpvote,
} from "./types";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Cross-site session persistence. The SDK's cookieFallback works only when
// Appwrite Cloud opts to send X-Fallback-Cookies, which it doesn't in every
// path. We always store the session secret in our own first-party
// localStorage and re-attach it via client.setSession() so the SDK sends
// X-Appwrite-Session on every request — independent of cookies.
const SESSION_KEY = "builtwith.session";
const persistSession = (secret: string | null) => {
  if (typeof window === "undefined") return;
  if (secret) {
    window.localStorage.setItem(SESSION_KEY, secret);
    client.setSession(secret);
  } else {
    window.localStorage.removeItem(SESSION_KEY);
    client.setSession("");
  }
};

// Attach the persisted session on initial module load.
if (typeof window !== "undefined") {
  const stored = window.localStorage.getItem(SESSION_KEY);
  if (stored) client.setSession(stored);
}

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);
const functions = new Functions(client);

export { client as appwriteClient, Query };

export const ClientAppwrite = {
  // Token-flow OAuth: Appwrite redirects back with ?userId&secret query
  // params, which we exchange for a session via createSession() on our own
  // origin. The SDK then stores the session secret in this origin's
  // localStorage and rides it on future calls via the X-Appwrite-Session
  // header — no reliance on the third-party cookie set by cloud.appwrite.io.
  signIn: () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("userId");
    url.searchParams.delete("secret");
    const success = url.toString();
    const failure = url.toString();
    account.createOAuth2Token(OAuthProvider.Github, success, failure);
  },
  completeOAuthSession: async (
    userId: string,
    secret: string
  ): Promise<Models.Session | null> => {
    try {
      const session = await account.createSession(userId, secret);
      persistSession(session.secret || session.$id);
      return session;
    } catch (err) {
      console.error("createSession failed:", err);
      return null;
    }
  },
  signOut: async () => {
    try {
      await account.deleteSession("current");
    } finally {
      persistSession(null);
    }
  },
  getAccount: async (): Promise<Models.User<Models.Preferences> | null> => {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },
  upvoteProject: async (projectId: string) => {
    const execution = await functions.createExecution(
      "upvoteProject",
      projectId
    );
    if (execution.status === "failed") {
      throw new Error(execution.errors || "Function failed");
    }
    if (
      execution.responseStatusCode < 200 ||
      execution.responseStatusCode >= 300
    ) {
      throw new Error(`Function returned ${execution.responseStatusCode}`);
    }
    // Body is sometimes empty for older runtimes / SDK combinations on Cloud.
    // When it's empty, treat as success (the side effect ran).
    if (!execution.responseBody) return { ok: true };
    let json;
    try {
      json = JSON.parse(execution.responseBody);
    } catch {
      // Malformed JSON, but the function returned 2xx — accept as success.
      return { ok: true };
    }
    if (json.ok === false) throw new Error(json.msg ?? "Function failed");
    return json;
  },
  listUpvotes: async (queries: string[]) => {
    return (
      await databases.listDocuments<ProjectUpvote>(
        "main",
        "projectUpvotes",
        queries
      )
    ).documents;
  },
  searchProjects: async (searchQuery: string): Promise<Project[]> => {
    const { documents } = await databases.listDocuments<Project>(
      "main",
      "projects",
      [
        Query.equal("isPublished", true),
        Query.search("search", searchQuery),
      ]
    );
    return documents;
  },
  listLatestProjects: async (limit = 12): Promise<Project[]> => {
    const { documents } = await databases.listDocuments<Project>(
      "main",
      "projects",
      [Query.equal("isPublished", true), Query.orderDesc("$createdAt"), Query.limit(limit)]
    );
    return documents;
  },
  hasUserUpvotedProject: async (
    userId: string,
    projectId: string
  ): Promise<boolean> => {
    const { total } = await databases.listDocuments<ProjectUpvote>(
      "main",
      "projectUpvotes",
      [
        Query.equal("userId", userId),
        Query.equal("projectId", projectId),
        Query.limit(1),
      ]
    );
    return total > 0;
  },
  uploadThumbnail: async (file: File) => {
    return await storage.createFile("thumbnails", ID.unique(), file);
  },
  deleteThumbnail: async (fileId: string) => {
    try {
      await storage.deleteFile("thumbnails", fileId);
    } catch {
      // best-effort rollback
    }
  },
  submitProject: async (data: unknown) => {
    const execution = await functions.createExecution(
      "submitProject",
      JSON.stringify(data)
    );
    if (!execution.responseBody) throw new Error("Unexpected error.");
    const json = JSON.parse(execution.responseBody);
    if (json.ok === false) throw new Error(json.msg);
    return json;
  },
};
