"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientAppwrite } from "~/lib/appwrite-client";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  type Project,
} from "~/lib/types";
import { useApp } from "./providers";

const thumbUrl = (imageId: string) =>
  `${APPWRITE_ENDPOINT}/storage/buckets/thumbnails/files/${imageId}/preview` +
  `?project=${APPWRITE_PROJECT_ID}&width=128&height=128&output=webp`;

export default function SearchModal() {
  const { searchOpen, closeSearch } = useApp();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Project[]>([]);
  const [selected, setSelected] = useState(-1);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      try {
        const list = term
          ? await ClientAppwrite.searchProjects(term)
          : await ClientAppwrite.listLatestProjects(12);
        if (!cancelled) {
          setResults(list);
          setSelected(-1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (!term) {
      run();
    } else {
      timer = setTimeout(run, 200);
    }
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

  const term = input.trim();
  const showEmpty = !loading && term && results.length === 0;

  return (
    <dialog
      ref={dialogRef}
      open
      className="search-modal-dialog"
      onClick={(e) => {
        if (e.target === dialogRef.current) closeSearch();
      }}
    >
      <div
        className="search-modal-card"
        role="combobox"
        aria-expanded="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="search-modal-input-row">
          <span
            className="icon-search search-modal-input-icon"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search projects…"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="search-modal-input"
            aria-label="Search projects"
          />
          {input ? (
            <button
              type="button"
              className="search-modal-clear"
              aria-label="Clear search"
              onClick={() => {
                setInput("");
                inputRef.current?.focus();
              }}
            >
              <span className="icon-x" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={closeSearch}
              className="search-modal-esc"
              aria-label="Close search"
            >
              esc
            </button>
          )}
        </div>

        {showEmpty ? (
          <div className="search-modal-empty">
            <span
              className="icon-search search-modal-empty-icon"
              aria-hidden="true"
            />
            <p className="search-modal-empty-title">No matches</p>
            <p className="search-modal-empty-hint">
              Nothing found for &ldquo;{term}&rdquo;. Try a different keyword.
            </p>
          </div>
        ) : (
          <div className="search-modal-list" ref={listRef}>
            {results.map((result, index) => {
              const isSelected = index === selected;
              return (
                <a
                  key={result.$id}
                  href={`/projects/${result.$id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    closeSearch();
                    router.push(`/projects/${result.$id}`);
                  }}
                  onMouseEnter={() => setSelected(index)}
                  className={`search-modal-item${
                    isSelected ? " is-selected" : ""
                  }`}
                  aria-selected={isSelected}
                >
                  <div className="search-modal-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumbUrl(result.imageId)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="search-modal-text">
                    <p className="search-modal-name">{result.name}</p>
                    <p className="search-modal-tagline">{result.tagline}</p>
                  </div>
                  <span
                    className="icon-cheveron-right search-modal-chevron"
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </div>
        )}

        <div className="search-modal-footer">
          <span className="search-modal-hint">
            <kbd className="search-modal-kbd">↑</kbd>
            <kbd className="search-modal-kbd">↓</kbd>
            Navigate
          </span>
          <span className="search-modal-hint">
            <kbd className="search-modal-kbd">↵</kbd>
            Open
          </span>
          <span className="search-modal-hint">
            <kbd className="search-modal-kbd">Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </dialog>
  );
}
