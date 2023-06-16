import type { QwikMouseEvent } from "@builder.io/qwik";
import {
  $,
  component$,
  useComputed$,
  useContext,
  useSignal,
} from "@builder.io/qwik";
import { AppwriteService } from "~/AppwriteService";
import { AccountContext, UpvotesContext } from "~/routes/layout";

type Props = {
  projectId: string;
  votes: number;
};

export default component$((props: Props) => {
  const upvotes = useContext(UpvotesContext);
  const account = useContext(AccountContext);

  const isLoading = useSignal(false);

  const isUpvotedServer = useComputed$(() => {
    console.log("isUpvotedServer", props.projectId, upvotes[props.projectId]);
    return upvotes[props.projectId];
  });
  const isUpvotedClient = useSignal(isUpvotedServer.value);
  const isUpvoted = useComputed$(() => {
    return isLoading.value ? isUpvotedClient.value : isUpvotedServer.value;
  });

  const countServer = useSignal(props.votes);
  const count = useComputed$(() => {
    if (isLoading.value) {
      return isUpvotedClient.value
        ? countServer.value + 1
        : countServer.value - 1;
    }
    return countServer.value;
  });

  const upvoteProject = $(async (e: QwikMouseEvent) => {
    e.stopPropagation();

    if (!account.value) {
      alert("Please sign in first.");
      return;
    }

    isUpvotedClient.value = !isUpvotedServer.value;
    isLoading.value = true;

    try {
      const response = await AppwriteService.upvoteProject(props.projectId);
      upvotes[props.projectId] = response.isUpvoted;
      countServer.value = response.votes;
    } catch (error: unknown) {
      alert("An unexpected error occurred.");
    } finally {
      isUpvotedClient.value = isUpvotedServer.value;
      isLoading.value = false;
    }
  });

  return (
    <button
      preventdefault:click
      onClick$={upvoteProject}
      class={`button upvote-button ${
        isUpvoted.value ? "is-primary" : "is-secondary"
      }`}
      aria-label="Upvote"
      aria-pressed={isUpvoted.value}
    >
      <span class="icon-heart" aria-hidden="true"></span>
      <span class="text">{count.value}</span>
    </button>
  );
});
