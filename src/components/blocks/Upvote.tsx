import type { QwikMouseEvent } from "@builder.io/qwik";
import {
  $,
  component$,
  useComputed$,
  useContext,
  useSignal,
} from "@builder.io/qwik";
import { AppwriteException } from "appwrite";
import { AppwriteService } from "~/AppwriteService";
import { AccountContext, UpvotesContext } from "~/routes/layout";

type Props = {
  projectId: string;
  votes: number;
  inline?: boolean;
};

export default component$((props: Props) => {
  const upvoteContext = useContext(UpvotesContext);
  const accountContext = useContext(AccountContext);

  const isLoading = useSignal(false);

  const isUpvotedServer = useComputed$(() => {
    return !!upvoteContext.value.find(
      (upvote) => upvote.projectId === props.projectId
    );
  });
  const isUpvotedClient = useSignal(isUpvotedServer.value);
  const isUpvoted = useComputed$(() => {
    return isLoading.value ? isUpvotedClient.value : isUpvotedServer.value;
  });

  const votesServer = useSignal(props.votes);
  const votes = useComputed$(() => {
    if (isLoading.value) {
      return isUpvotedClient.value
        ? votesServer.value + 1
        : votesServer.value - 1;
    }
    return votesServer.value;
  });

  const upvoteProject = $(async (e: QwikMouseEvent) => {
    e.stopPropagation();

    isUpvotedClient.value = !isUpvotedServer.value;
    isLoading.value = true;

    try {
      const res = await AppwriteService.upvoteProject(props.projectId);
      if (accountContext.value) {
        upvoteContext.value = await AppwriteService.listUserUpvotes(
          accountContext.value.$id
        );
      }
      votesServer.value = res.votes;
    } catch (error: unknown) {
      if (error instanceof AppwriteException && error.code === 401) {
        alert("Please sign in first.");
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      isUpvotedClient.value = isUpvotedServer.value;
      isLoading.value = false;
    }
  });

  return (
    <button
      preventdefault:click
      onClick$={upvoteProject}
      class={`button upvote-button ${props.inline ? "" : "vertical-button"} ${
        isUpvoted.value ? "is-primary" : "is-secondary"
      }`}
      aria-label="Upvote"
      aria-pressed={isUpvoted.value}
    >
      <span class="icon-heart" aria-hidden="true"></span>
      <span class="text">{votes.value}</span>
    </button>
  );
});
