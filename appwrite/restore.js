require("dotenv").config();

const { readFileSync } = require("fs");
const { Databases, Client } = require("node-appwrite");

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("builtWithAppwrite")
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

(async () => {
  const documents = JSON.parse(
    readFileSync("backup_1684004676523.json").toString()
  );

  for (const document of documents) {
    await databases.createDocument("main", "projects", document.$id, {
      ...document,
      $createdAt: undefined,
      $updatedAt: undefined,
      $id: undefined,
      $databaseId: undefined,
      $collectionId: undefined,
      $permissions: undefined,
    });
  }
})();
