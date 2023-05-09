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

  const projectId = req.payload ?? "";
  console.log(`Upvoting project: ${projectId}`);

  if (!projectId) {
    return res.json({ ok: false, msg: "Missing project ID." });
  }

  const userId = req.variables["APPWRITE_FUNCTION_USER_ID"] ?? "";
  console.log(`Upvoting by user: ${userId}`);

  const search = await databases.listDocuments("main", "projectUpvotes", [
    sdk.Query.limit(1),
    sdk.Query.equal("projectId", projectId),
    sdk.Query.equal("userId", userId),
  ]);

  const isUpvoted = search.documents.length > 0;

  console.log(`Is already upvoted: ${isUpvoted ? "yes" : "no"}`);

  if (isUpvoted) {
    await databases.deleteDocument(
      "main",
      "projectUpvotes",
      search.documents[0].$id
    );
  } else {
    await databases.createDocument("main", "projectUpvotes", sdk.ID.unique(), {
      projectId,
      userId,
    });
  }

  console.log("Aggregating upvotes count ...");

  const aggregation = await databases.listDocuments("main", "projectUpvotes", [
    sdk.Query.limit(1),
    sdk.Query.equal("projectId", projectId),
  ]);

  const totalUpvotes = aggregation.total;

  console.log(`Updating votes to: ${totalUpvotes}`);

  await databases.updateDocument("main", "projects", projectId, {
    upvotes: totalUpvotes,
  });

  res.json({
    ok: true,
    isUpvoted: !isUpvoted,
    votes: totalUpvotes,
  });
};
