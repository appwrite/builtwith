import { Account, Client } from "appwrite";

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
};

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("builtWithAppwrite");

const account = new Account(client);

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
};
