import { component$ } from "@builder.io/qwik";

export default component$(
  (props: { votes: number; upvoted: boolean; inline?: boolean }) => {
    return (
      <button
        class={`button upvote-button ${props.inline ? "" : "vertical-button"} ${
          props.upvoted ? "is-primary" : "is-secondary"
        }`}
        aria-label="Upvote"
      >
        <span class="icon-heart" aria-hidden="true"></span>
        <span class="text">{props.votes}</span>
      </button>
    );
  }
);
