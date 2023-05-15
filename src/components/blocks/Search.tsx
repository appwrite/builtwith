import {
  $,
  component$,
  useContext,
  useSignal,
  useStore,
  useStylesScoped$,
  useTask$,
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

  useTask$(async ({ track }) => {
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

  const onKeyDown = $(function onKeyDown(e: KeyboardEvent) {
    const results = state.searchResults.length ? state.searchResults : [];
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
      window.location.href = result.url;
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

  useStylesScoped$(`
    .search-item {
      display: flex;
      flex-direction: column;
      border-radius: var(--border-radius-small);
      padding: 8px 12px;

     
    }

    .search-item:hover,
    .search-item.selected {
      background-color: hsl(var(--color-neutral-200));

      :global(.theme-light) & {
        background-color: hsl(var(--color-neutral-10));
      }
    }

    .results {
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow: auto;
      max-height: 100%;
      margin-top: 16px;
    }
  `);

  return (
    <div
      class="card u-position-absolute u-flex u-flex-vertical u-overflow-hidden"
      style="top: 50%; left: 50%; translate: -50% -50%; width: 600px; max-width: calc(100% - 2rem); height: 400px; max-height: calc(100% - 2rem);"
    >
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
        <div class="box results">
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
