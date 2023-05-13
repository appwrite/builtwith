require("dotenv").config();

const { readFileSync } = require("fs");
const { Databases, Client } = require("node-appwrite");

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("builtWithAppwrite")
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

(async () => {
  docs = JSON.parse(readFileSync('backup_1684004676523.json').toString());

  for(doc of docs) {
    await databases.createDocument('main', 'projects', doc.$id, {
      ...doc,
      '$createdAt': undefined,
      '$updatedAt': undefined,
      '$id': undefined,
      '$databaseId': undefined,
      '$collectionId': undefined,
      '$permissions': undefined,
    });
  }
})();
