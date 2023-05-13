require("dotenv").config();

const { writeFileSync } = require("fs");
const { Databases, Client, Query } = require("node-appwrite");

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("builtWithAppwrite")
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const fetchAllDocument = async () => {
  const allDocs = [];

  let cursor = null;
  do {
    const queries = [Query.limit(100), Query.orderDesc("$createdAt")];

    if (cursor) {
      queries.push(Query.cursorAfter(cursor));
    }

    const docs = await databases.listDocuments('main', 'projects', queries);

    allDocs.push(...docs.documents);

    if(docs.documents.length > 0) {
        cursor = docs.documents[docs.documents.length - 1].$id;
    } else {
        cursor = null;
    }
  } while (cursor !== null);

  return allDocs;
};

(async () => {
  const allDocs = await fetchAllDocument();
  writeFileSync('backup_' + Date.now() + '.json', JSON.stringify(allDocs));
})();
