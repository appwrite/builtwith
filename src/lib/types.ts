import type { Models } from "appwrite";

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
  isPublished: boolean;
  isFeatured?: boolean;
  hasAuthentication: boolean;
  hasMessaging: boolean;
  hasStorage: boolean;
  hasRealtime: boolean;
  hasFunctions: boolean;
  hasDatabases: boolean;
} & Models.Document;

export type ProjectUpvote = {
  projectId: string;
  userId: string;
} & Models.Document;

export const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
export const APPWRITE_PROJECT_ID = "builtWithAppwrite";
