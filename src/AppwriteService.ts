import { ID, type Models } from "appwrite";
import {
  Account,
  Client,
  Databases,
  Functions,
  Query,
  Storage,
} from "appwrite";

// Manually kept in sync with Appwrite collection attributes
export type Project = {
  platform: string;
  name: string;
  tagline: string;
  description: string;
  upvotes: number;
  framework?: string;
  uiLibrary?: string;
  useCase: string;
  urlWebsite?: string;
  urlArticle?: string;
  urlTwitter?: string;
  urlGitHub?: string;
  urlWindows?: string;
  urlMacOs?: string;
  urlLinux?: string;
  urlAppStore?: string;
  urlGooglePlay?: string;
  imageId: string;
  hasAuthentication: boolean;
  hasMessaging: boolean;
  hasStorage: boolean;
  hasRealtime: boolean;
  hasFunctions: boolean;
  hasDatabases: boolean;
} & Models.Document;

export type ProjectService = {
  projectId: string;
  service: string;
} & Models.Document;

export type ProjectUpvote = {
  projectId: string;
  userId: string;
} & Models.Document;

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("builtWithAppwrite");

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);
const functions = new Functions(client);

export const AppwriteService = {
  signIn: () => {
    const redirectUrl = window.location.href;
    account.createOAuth2Session("github", redirectUrl, redirectUrl);
  },
  signOut: async () => {
    await account.deleteSession("current");
  },
  getAccount: async () => {
    try {
      return await account.get();
    } catch (err) {
      // console.log(err);
      return null;
    }
  },
  countProjects: async (queries: string[]) => {
    const hasIsPublished = queries.find((query) =>
      query.startsWith('equal("isPublished')
    );
    const hasCreatedAtSort = queries.find(
      (query) =>
        query.startsWith('orderDesc("$createdAt') ||
        query.startsWith('orderAsc("$createdAt')
    );

    if (!hasIsPublished) {
      queries.push(Query.equal("isPublished", true));
    }

    if (!hasCreatedAtSort) {
      queries.push(Query.orderDesc("$createdAt"));
    }

    const response = await databases.listDocuments<Project>(
      "main",
      "projects",
      queries
    );

    return response.total;
  },
  getProject: async (projectId: string) => {
    const project = await databases.getDocument<Project>(
      "main",
      "projects",
      projectId
    );
    return project;
  },
  listProjects: async (queries: string[]) => {
    const hasIsPublished = queries.find((query) =>
      query.startsWith('equal("isPublished')
    );
    const hasCreatedAtSort = queries.find(
      (query) =>
        query.startsWith('orderDesc("$createdAt') ||
        query.startsWith('orderAsc("$createdAt')
    );

    if (!hasIsPublished) {
      queries.push(Query.equal("isPublished", true));
    }

    if (!hasCreatedAtSort) {
      queries.push(Query.orderDesc("$createdAt"));
    }

    const { documents: projects } = await databases.listDocuments<Project>(
      "main",
      "projects",
      queries
    );

    return projects;
  },
  searchProjects: async (searchQuery: string) => {
    const { documents: projects } = await databases.listDocuments<Project>(
      "main",
      "projects",
      [Query.search("search", searchQuery)]
    );

    return projects.filter((project) => project.isPublished);
  },
  getProjectThumbnail: (fileId: string, width = 1280) => {
    return storage
      .getFilePreview(
        "thumbnails",
        fileId,
        width,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "webp"
      )
      .toString();
  },
  upvoteProject: async (projectId: string) => {
    const execution = await functions.createExecution(
      "upvoteProject",
      projectId
    );

    if (!execution.response) {
      throw new Error("Unexpected error occured.");
    }

    const json = JSON.parse(execution.response);

    if (json.ok === false) {
      throw new Error(json.msg);
    }

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
  listUserUpvotes: async (userId: string, queries: string[] = []) => {
    const defaultQueries = [
      Query.equal("userId", userId),
      Query.orderDesc("$createdAt"),
    ];

    queries = [...queries, ...defaultQueries];

    return (
      await databases.listDocuments<ProjectUpvote>(
        "main",
        "projectUpvotes",
        queries
      )
    ).documents;
  },
  uploadThumbnail: async (file: File) => {
    return await storage.createFile("thumbnails", ID.unique(), file);
  },
  submitProject: async (data: any) => {
    const execution = await functions.createExecution(
      "submitProject",
      JSON.stringify(data)
    );

    if (!execution.response) {
      throw new Error("Unexpected error occured.");
    }

    const json = JSON.parse(execution.response);

    if (json.ok === false) {
      throw new Error(json.msg);
    }

    return json;
  },
};
