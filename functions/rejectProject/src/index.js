const sdk = require("node-appwrite");
const nodemailer = require("nodemailer");
const template = require("./template");

module.exports = async function (req, res) {
  const client = new sdk.Client();
  const user = new sdk.Users(client);
  const database = new sdk.Databases(client);

  if (!req.variables["APPWRITE_FUNCTION_API_KEY"]) {
    throw new Error("Appwrite credentials not set.");
  }

  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
    .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"]);

  const SMTP_URL = req.variables["SMTP_URL"];
  const SMTP_PORT = req.variables["SMTP_PORT"];
  const SMTP_USERNAME = req.variables["SMTP_USERNAME"];
  const SMTP_PASSWORD = req.variables["SMTP_PASSWORD"];
  if (!SMTP_URL || !SMTP_PORT || !SMTP_USERNAME || !SMTP_PASSWORD) {
    throw new Error("Missing SMTP credentials.");
  }

  const project = JSON.parse(req.variables["APPWRITE_FUNCTION_EVENT_DATA"]);
  if (!project || !project.userId || !project.name) {
    throw new Error("Invalid project update event.");
  }

  if (!project.rejectionReason || project.isPublished) {
    console.log("Project has no rejection reason or is already published.");
    res.json({ ok: true });
    return;
  }

  console.log("Fetching project author");
  const author = await user.get(project.userId);
  if (!author || !author.email) {
    throw new Error("Project author has no email.");
  }
  console.log("Done");

  const transporter = nodemailer.createTransport({
    host: SMTP_URL,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
    secure: false,
    tls: {
      ciphers: "SSLv3",
    },
  });

  console.log("Sending email to project author");
  try {
    await transporter.sendMail({
      from: SMTP_USERNAME,
      to: author.email,
      bcc: req.variables["APPROVER_EMAILS"],
      subject: "Project Review - builtwith.appwrite.io ",
      text: template(project),
    });
    console.log("Done");
  } catch (error) {
    throw new Error(`Failed to send email: ${error}`);
  }

  console.log("Deleting the project document");
  try {
    await database.deleteDocument("main", "projects", project.$id);
    console.log("Done");
  } catch (error) {
    throw new Error(`Failed to delete project: ${error}`);
  }

  res.json({
    ok: true,
  });
};
