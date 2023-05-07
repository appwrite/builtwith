const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client();

  const databases = new sdk.Databases(client);

  if (!req.variables["APPWRITE_FUNCTION_API_KEY"]) {
    throw new Error("Environment variables are not set.");
  }

  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
    .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"]);

  console.log("Paginating whole collection...");

  let cursorId = null;
  do {
    console.log("Page rotation iteration");

    const queries = [sdk.Query.limit(100), sdk.Query.orderDesc("$createdAt")];

    if (cursorId) {
      queries.push(sdk.Query.cursorAfter(cursorId));
    }

    const { documents } = await databases.listDocuments(
      "main",
      "projects",
      queries
    );

    for (const document of documents) {
      await databases.updateDocument("main", "projects", document.$id, {
        randomness: Math.random(),
      });
    }

    cursorId = documents[documents.length - 1]?.$id ?? null;
  } while (cursorId !== null);

  console.log("Success.");

  res.json({
    ok: true,
  });
};
