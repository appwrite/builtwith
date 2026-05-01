import { createFileRoute } from "@tanstack/react-router";
import SubmitForm from "./-submit-project-form";

export const Route = createFileRoute("/submit-project")({
  head: () => ({
    meta: [
      { title: "Submit Project | Built with Appwrite" },
      { name: "description", content: "Submit your project to Built with Appwrite." },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: SubmitProjectPage,
});

function SubmitProjectPage() {
  return <SubmitForm />;
}
