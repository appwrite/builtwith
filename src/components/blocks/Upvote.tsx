import {
  $,
  component$,
  useComputed$,
  useContext,
  useSignal,
} from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { AppwriteService } from "~/AppwriteService";
import { AccountContext, UpvotesContext } from "~/routes/layout";

export default component$(
  (props: { projectId: string; votes: number; inline?: boolean }) => {
    const nav = useNavigate();
    const upvoteContext = useContext(UpvotesContext);
    const accountContext = useContext(AccountContext);
    const isUpvoted = useComputed$(() => {
      return upvoteContext.value.find(
        (upvote) => upvote.projectId === props.projectId
      )
        ? true
        : false;
    });

    const isLoading = useSignal(false);

    const upvoteProject = $(async () => {
      isLoading.value = true;
      try {
        await AppwriteService.upvoteProject(props.projectId);

        if (accountContext.value) {
          upvoteContext.value = await AppwriteService.listUpvotes(
            accountContext.value.$id
          );
        }

        // TODO: Do current path somehow
        await nav("/", true);
      } catch (err: any) {
        alert(err.message);
      } finally {
        isLoading.value = false;
      }
    });

    let isPrimary = true;

    if (isUpvoted.value === false || isLoading.value === true) {
      isPrimary = false;
    }

    return (
      <button
        preventdefault:click
        onClick$={upvoteProject}
        class={`button upvote-button ${props.inline ? "" : "vertical-button"} ${
          isPrimary ? "is-primary" : "is-secondary"
        }`}
        aria-label="Upvote"
      >
        {isLoading.value === true ? (
          <div style="transform: scale(0.8);">
            <div class="loader"></div>
          </div>
        ) : (
          <>
            <span class="icon-heart" aria-hidden="true"></span>
            <span class="text">{props.votes}</span>
          </>
        )}
      </button>
    );
  }
);
