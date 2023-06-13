const sdk = require("node-appwrite");

const client = new sdk.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("builtWithAppwrite")
  .setKey("---");

const databases = new sdk.Databases(client);

async function generateSearch() {
  // Get all projects
  const { documents: projects } = await databases.listDocuments(
    "main",
    "projects"
  );

  for (const project of projects) {
    const { $id, useCase, uiLibrary, framework, name, tagline } = project;

    // Build combined string for full-text search index
    const search = `${name} ${tagline} ${framework} ${uiLibrary} ${useCase}`;

    // Update project with search string

    await databases.updateDocument("main", "projects", $id, {
      search,
    });

    console.log(`Updated project ${name}`);
  }
}

generateSearch();
