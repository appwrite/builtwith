"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientAppwrite } from "~/lib/appwrite-client";
import type { Project } from "~/lib/types";
import { useApp } from "./providers";

export default function SearchModal() {
  const { searchOpen, closeSearch } = useApp();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Project[]>([]);
  const [selected, setSelected] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
      setSelected(-1);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const term = input.trim();
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const run = async () => {
      const list = term
        ? await ClientAppwrite.searchProjects(term)
        : await ClientAppwrite.listLatestProjects(12);
      if (!cancelled) {
        setResults(list);
        setSelected(-1);
      }
    };
    if (!term) {
      run();
    } else {
      timer = setTimeout(run, 200);
    }
    // Always return the cleanup so the cancellation flag flips even on the
    // empty-term path; otherwise a slow listLatestProjects can resolve after
    // a newer search and overwrite results.
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [input, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, -1));
      } else if (e.key === "Enter") {
        const r = results[selected];
        if (r) {
          e.preventDefault();
          closeSearch();
          router.push(`/projects/${r.$id}`);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results, selected, searchOpen, closeSearch, router]);

  useEffect(() => {
    if (selected < 0 || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLAnchorElement>(
      `a:nth-child(${selected + 1})`
    );
    if (!el) return;
    const inView =
      el.offsetTop >= listRef.current.scrollTop &&
      el.offsetTop + el.offsetHeight <=
        listRef.current.scrollTop + listRef.current.offsetHeight;
    if (!inView) {
      listRef.current.scrollTo({
        top: el.offsetTop - listRef.current.offsetHeight / 2,
        behavior: "smooth",
      });
    }
  }, [selected]);

  if (!searchOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      open
      onClick={(e) => {
        if (e.target === dialogRef.current) closeSearch();
      }}
      style={{
        position: "fixed",
        zIndex: 10000,
        backgroundColor: "#00000080",
        color: "hsl(var(--search-color))",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: 0,
      }}
    >
      <div
        className="card u-position-absolute u-flex u-flex-vertical u-overflow-hidden search-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="input-text-wrapper is-with-end-button">
          <input
            type="search"
            placeholder="Search"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="icon-search" aria-hidden="true" />
          <button
            type="button"
            className="button is-text is-only-icon"
            aria-label="Clear search"
            style={{ ["--button-size" as string]: "1.5rem" }}
            onClick={() => {
              setInput("");
              inputRef.current?.focus();
            }}
            disabled={!input}
          >
            <span className="icon-x" aria-hidden="true" />
          </button>
        </div>
        <div className="box search-results" ref={listRef}>
          {results.map((result, index) => (
            <a
              key={result.$id}
              href={`/projects/${result.$id}`}
              onClick={(e) => {
                e.preventDefault();
                closeSearch();
                router.push(`/projects/${result.$id}`);
              }}
              className={`search-item${index === selected ? " selected" : ""}`}
            >
              <p style={{ fontWeight: 800 }}>{result.name}</p>
              <p>{result.tagline}</p>
            </a>
          ))}
        </div>
      </div>
    </dialog>
  );
}
