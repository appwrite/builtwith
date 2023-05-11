import {
  $,
  component$,
  useComputed$,
  useContext,
  useSignal,
} from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { AppwriteService } from "~/AppwriteService";
import { AccountContext, UpvotesContext } from "~/routes/layout";

export default component$(
  (props: { projectId: string; votes: number; inline?: boolean }) => {
    const location = useLocation();
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

    const votes = useSignal(props.votes);

    const isLoading = useSignal(false);

    const upvoteProject = $(async () => {
      isLoading.value = true;
      try {
        const res = await AppwriteService.upvoteProject(props.projectId);

        if (accountContext.value) {
          upvoteContext.value = await AppwriteService.listUserUpvotes(
            accountContext.value.$id
          );
        }

        votes.value = res.votes;
        // isUpvoted.value = res.isUpvoted;

        const navUrl = location.url.pathname + location.url.search;
        await nav(navUrl, true);
      } catch (err: any) {
        if (err.code && err.code === 401) {
          alert("Please sign in first.");
        } else {
          alert(err.message);
        }
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
          <>
            <div style="transform: scale(0.8); height: 20px;">
              <div class="loader"></div>
            </div>
            <span class="text">{votes}</span>
          </>
        ) : (
          <>
            <span class="icon-heart" aria-hidden="true"></span>
            <span class="text">{votes}</span>
          </>
        )}
      </button>
    );
  }
);
