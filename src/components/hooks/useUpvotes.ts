import type { Signal } from "@builder.io/qwik";
import { useContext, useVisibleTask$ } from "@builder.io/qwik";
import { Query } from "appwrite";
import { AppwriteService } from "~/AppwriteService";
import { AccountContext, UpvotesContext } from "~/routes/layout";

export function useUpvotes(projectIds: Signal<string[]>) {
  const upvotes = useContext(UpvotesContext);
  const account = useContext(AccountContext);

  useVisibleTask$(async ({ track }) => {
    track(() => [account?.value, projectIds.value]);
    if (!account?.value) {
      return;
    }

    if (account.value) {
      const newProjectIds = projectIds.value.filter(
        (projectId) => upvotes[projectId] === undefined
      );

      if (newProjectIds.length === 0) {
        return;
      }

      const projectUpvotes = await AppwriteService.listUserUpvotes(
        account.value.$id,
        [Query.equal("projectId", newProjectIds)]
      );

      projectUpvotes.forEach((upvote) => {
        upvotes[upvote.projectId] = true;
      });
    }
  });
}
