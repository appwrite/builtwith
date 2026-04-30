import type { Metadata } from "next";
import SubmitForm from "./form";

export const metadata: Metadata = {
  title: "Submit Project | Built with Appwrite",
  description: "Submit your project to Built with Appwrite.",
};

export default function SubmitProjectPage() {
  return <SubmitForm />;
}
