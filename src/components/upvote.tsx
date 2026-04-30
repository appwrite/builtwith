"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { ClientAppwrite } from "~/lib/appwrite-client";
import { useApp } from "./providers";

type Props = {
  projectId: string;
  votes: number;
};

export default function Upvote({ projectId, votes }: Props) {
  const { account } = useApp();
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [count, setCount] = useState(votes);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!account) {
      setIsUpvoted(false);
      return;
    }
    let cancelled = false;
    ClientAppwrite.hasUserUpvotedProject(account.$id, projectId)
      .then((v) => {
        if (!cancelled) setIsUpvoted(v);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [account, projectId]);

  const onClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!account) {
      alert("Please sign in first.");
      return;
    }
    if (isLoading) return;

    // Optimistic flip: toggle UI immediately, reconcile on server response.
    const prevIsUpvoted = isUpvoted;
    const prevCount = count;
    const nextIsUpvoted = !prevIsUpvoted;
    setIsUpvoted(nextIsUpvoted);
    setCount(prevCount + (nextIsUpvoted ? 1 : -1));
    setIsLoading(true);

    try {
      const response = await ClientAppwrite.upvoteProject(projectId);
      // Honour server-returned values when present; otherwise keep our
      // optimistic state (the side effect ran since the function returned 2xx).
      if (typeof response?.isUpvoted === "boolean") {
        setIsUpvoted(response.isUpvoted);
      }
      if (typeof response?.votes === "number") {
        setCount(response.votes);
      }
    } catch (err) {
      // Roll back on failure.
      setIsUpvoted(prevIsUpvoted);
      setCount(prevCount);
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Could not record your vote. Try again in a moment.";
      console.error("upvote failed:", err);
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`button upvote-button ${
        isUpvoted ? "is-primary" : "is-secondary"
      }`}
      aria-label="Upvote"
      aria-pressed={isUpvoted}
      aria-busy={isLoading}
    >
      <span className="icon-heart" aria-hidden="true" />
      <span className="text">{count}</span>
    </button>
  );
}
