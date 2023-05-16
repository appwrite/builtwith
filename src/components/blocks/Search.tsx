import {
  $,
  component$,
  useContext,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";
import type { Project } from "~/AppwriteService";
import { AppwriteService } from "~/AppwriteService";
import { SearchModalContext } from "~/routes/layout";

export default component$(() => {
  const input = useSignal("");
  const inputRef = useSignal<HTMLInputElement>();
  const searchModal = useContext(SearchModalContext);

  const state = useStore({
    searchResults: [] as Project[],
    selectedResult: -1,
  });

  useVisibleTask$(async ({ track }) => {
    const searchInput = track(() => input.value.trim());

    if (!searchInput) {
      state.searchResults = await AppwriteService.listProjects([]);
      return;
    }
    const timer = setTimeout(async () => {
      state.searchResults = await AppwriteService.searchProjects(searchInput);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  });

  const onKeyDown = $((e: KeyboardEvent) => {
    const results = state.searchResults;
    if (!searchModal.isOpen.value) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      state.selectedResult = Math.min(
        state.selectedResult + 1,
        results.length - 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      state.selectedResult = Math.max(state.selectedResult - 1, -1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const result = results[state.selectedResult];
      if (!result) return;
      window.location.href = `/projects/${result.$id}`;
    }
  });

  useVisibleTask$(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useVisibleTask$(async ({ track }) => {
    const isOpen = track(() => searchModal.isOpen.value);
    if (isOpen) inputRef.value?.focus();
  });

  return (
    <div class="card u-position-absolute u-flex u-flex-vertical u-overflow-hidden search-modal">
      <div class="input-text-wrapper is-with-end-button">
        <input
          type="search"
          placeholder="Search"
          ref={inputRef}
          bind:value={input}
        />
        <div class="icon-search" aria-hidden="true"></div>
        <button
          class="button is-text is-only-icon"
          aria-label="Clear search"
          style="--button-size: 1.5rem;"
          onClick$={() => {
            input.value = "";
            inputRef.value?.focus();
          }}
          disabled={!input.value}
        >
          <span class="icon-x" aria-hidden="true"></span>
        </button>
      </div>
      {state.searchResults && (
        <div class="box search-results">
          {state.searchResults.map((result, index) => {
            return (
              <a
                key={index}
                href={`/projects/${result.$id}`}
                class={{
                  "search-item": true,
                  selected: index === state.selectedResult,
                }}
              >
                <p style="font-weight: 800;">{result.name}</p>
                <p>{result.tagline}</p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
});
