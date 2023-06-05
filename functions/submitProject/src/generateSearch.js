const sdk = require("node-appwrite");

const client = new sdk.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("builtWithAppwrite")
  .setKey(
    "d8220f98dc65a331ccc908647bf89fbd79ffda64e03512ea1e1266127092b5e1cfb45d21b0357646a80f3adad5da5876c1bf98b390c4247e98f4ce0ffeb4fc24231a3ea2ab141056b607896fcec9ca9cebdca7feda0faa4f810c327cc38988c454685dc401c9a17a4b75cc90491e53442654ac0d8b1f7fe828588a53bc595650"
  );

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
