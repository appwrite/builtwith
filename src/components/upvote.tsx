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
    setIsLoading(true);
    try {
      const response = await ClientAppwrite.upvoteProject(projectId);
      setIsUpvoted(Boolean(response.isUpvoted));
      setCount(Number(response.votes ?? count));
    } catch {
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`button upvote-button ${
        isUpvoted ? "is-primary" : "is-secondary"
      }`}
      aria-label="Upvote"
      aria-pressed={isUpvoted}
    >
      <span className="icon-heart" aria-hidden="true" />
      <span className="text">{count}</span>
    </button>
  );
}
