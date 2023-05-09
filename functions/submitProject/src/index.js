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

  const payload = JSON.parse(req.payload ?? "{}");
  console.log(`Got payload:`);
  console.log(payload);

  const {
    useCase,
    uiLibrary,
    framework,
    name,
    tagline,
    description,
    services,
    urlWebsite,
    urlTwitter,
    urlGitHub,
    urlArticle,
    fileId,
  } = payload;

  if (
    !useCase ||
    !uiLibrary ||
    !framework ||
    !name ||
    !tagline ||
    !description ||
    !fileId
  ) {
    return res.json({
      ok: false,
      msg: "Please fill in all the defail. Only URLs are optional.",
    });
  }

  if (services.length <= 0) {
    return res.json({
      ok: false,
      msg: "Your project must use at least one Appwrite service.",
    });
  }

  const userId = req.variables["APPWRITE_FUNCTION_USER_ID"] ?? "";
  console.log(`Submitted by user: ${userId}`);

  console.log("Creating project");

  const project = await databases.createDocument(
    "main",
    "projects",
    sdk.ID.unique(),
    {
      name,
      tagline,
      description,
      upvotes: 0,
      framework,
      uiLibrary,
      useCase,
      urlWebsite: urlWebsite ? urlWebsite : undefined,
      urlTwitter: urlTwitter ? urlTwitter : undefined,
      urlGitHub: urlGitHub ? urlGitHub : undefined,
      urlArticle: urlArticle ? urlArticle : undefined,
      imageId: fileId,
      isPublished: false,
      isFeatured: false,
      randomness: 99,

      hasAuthentication: services.includes("authentication"),
      hasStorage: services.includes("storage"),
      hasRealtime: services.includes("relatime"),
      hasFunctions: services.includes("functions"),
      hasDatabases: services.includes("databases"),
    }
  );

  console.log("Done");

  res.json({
    ok: true,
    msg: "Submission successful. Please allow us some time to review your project.",
  });
};
