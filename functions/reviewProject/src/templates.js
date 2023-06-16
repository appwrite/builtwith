function servicesTemplate(project) {
  const serviceFields = [
    { name: "Authentication", key: "hasAuthentication" },
    { name: "Storage", key: "hasStorage" },
    { name: "Realtime", key: "hasRealtime" },
    { name: "Functions", key: "hasFunctions" },
    { name: "Databases", key: "hasDatabases" },
  ];

  return serviceFields
    .filter(({ key }) => project[key])
    .map(({ name }) => name)
    .join(", ");
}

function formatFields(project, fields) {
  return fields
    .map(({ name, key }) => (project[key] ? `${name}: ${project[key]}\n` : ""))
    .join("");
}

function projectTemplate(project) {
  const projectFields = [
    { name: "Name", key: "name" },
    { name: "Description", key: "description" },
    { name: "Tagline", key: "tagline" },
    { name: "Use Case", key: "useCase" },
    { name: "Services", key: "services" },
    { name: "Framework", key: "framework" },
    { name: "UI Library", key: "uiLibrary" },
    { name: "Platform", key: "platform" },
    { name: "Website", key: "urlWebsite" },
    { name: "Article", key: "urlArticle" },
    { name: "Twitter", key: "urlTwitter" },
    { name: "GitHub", key: "urlGitHub" },
    { name: "Google Play", key: "urlGooglePlay" },
    { name: "App Store", key: "urlAppStore" },
    { name: "Linux", key: "urlLinux" },
    { name: "MacOS", key: "urlMacOs" },
    { name: "Windows", key: "urlWindows" },
  ];

  project.services = servicesTemplate(project);
  return formatFields(project, projectFields);
}

function rejectionTemplate(project) {
  return `Hey 👋,
Thank you for submitting your project "${project.name}" to Built With Appwrite.

Unfortunately, we have decided to reject it for the following reason:
> ${project.rejectionReason}
Don't sweat it, though! This is all part of the process and an opportunity for growth. 🌱
After addressing the reason for rejection, feel free to submit the project again. We'd be excited to see your improved version! 🚀

Your Project
${projectTemplate(project)}

Keep on coding and creating awesome stuff! 💻🔥
The Built With Appwrite Team`;
}

function approvalTemplate(project) {
  return `Hey 👋,
Thank you for submitting your project "${project.name}" to Built With Appwrite.

We have reviewed your project, made any neccessary changes and decided to approve it! 🎉
You can now find it on our website: https://builtwith.appwrite.io/projects/${project.$id}

Keep on coding and creating awesome stuff! 💻🔥
The Built With Appwrite Team`;
}

module.exports = { rejection: rejectionTemplate, approval: approvalTemplate };
