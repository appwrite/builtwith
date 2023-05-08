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
  name: string;
  tagline: string;
  description: string;
  upvotes: number;
  framework: string;
  uiLibrary: string;
  useCase: string;
  urlWebsite?: string;
  urlArticle?: string;
  urlTwitter?: string;
  urlGitHub?: string;
  imageId: string;
  randomness: number;

  services: string[];
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
      console.log(err);
      return null;
    }
  },
  countProjects: async (queries: string[]) => {
    queries = [
      ...queries,
      Query.equal("isPublished", true),
      Query.orderDesc("$createdAt"),
    ];

    const response = await databases.listDocuments<Project>(
      "main",
      "projects",
      queries
    );

    return response.total;
  },
  listProjects: async (queries: string[]) => {
    queries = [
      ...queries,
      Query.equal("isPublished", true),
      Query.orderDesc("$createdAt"),
    ];

    let { documents: projects } = await databases.listDocuments<Project>(
      "main",
      "projects",
      queries
    );

    const projectIds = [...new Set(projects.map((project) => project.$id))];

    if (projectIds.length > 0) {
      const { documents: services } =
        await databases.listDocuments<ProjectService>(
          "main",
          "projectServices",
          [Query.equal("projectId", projectIds), Query.orderDesc("$createdAt")]
        );

      projects = projects.map((project) => {
        const projectServices = services.filter(
          (service) => service.projectId === project.$id
        );

        project.services = projectServices.map((service) => service.service);

        return project;
      });
    }

    return projects;
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
  listUpvotes: async (userId: string) => {
    return (
      await databases.listDocuments<ProjectUpvote>("main", "projectUpvotes", [
        Query.limit(100),
        Query.equal("userId", userId),
      ])
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
