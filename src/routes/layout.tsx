import type { QRL, QwikKeyboardEvent, QwikMouseEvent } from "@builder.io/qwik";
import { useStore } from "@builder.io/qwik";
import {
  $,
  component$,
  createContextId,
  type Signal,
  Slot,
  useContextProvider,
  useSignal,
  useVisibleTask$,
  useComputed$,
  useTask$,
} from "@builder.io/qwik";
import { routeLoader$, useLocation, useNavigate } from "@builder.io/qwik-city";
import type { Models } from "appwrite";
import type { ProjectUpvote } from "~/AppwriteService";
import { AppwriteService } from "~/AppwriteService";
import { Config } from "~/Config";
import Search from "~/components/blocks/Search";
import Footer from "~/components/layout/Footer";
import Header from "~/components/layout/Header";

export const UpvotesContext = createContextId<Signal<ProjectUpvote[]>>(
  "app.upvotes-context"
);

export const AccountContext = createContextId<Signal<null | Models.User<any>>>(
  "app.account-context"
);

export const ThemeContext =
  createContextId<Signal<"light" | "dark">>("app.theme-context");

export const SearchModalContext = createContextId<{
  open: QRL<() => void>;
  close: QRL<() => void>;
  isOpen: Signal<boolean>;
}>("app.search-modal-context");

export const useThemeLoader = routeLoader$<"light" | "dark">(
  async (requestEvent) => {
    const cookieValue = requestEvent.cookie.get(
      "theme_buildwithappwrite"
    )?.value;
    return cookieValue === "dark" ? "dark" : "light";
  }
);

export default component$(() => {
  const account = useSignal<null | Models.User<any>>(null);
  useContextProvider(AccountContext, account);

  const themeData = useThemeLoader();
  const theme = useSignal(themeData.value ?? "dark");
  useContextProvider(ThemeContext, theme);

  const location = useLocation();
  const nav = useNavigate();

  const searchIsOpen = useSignal<boolean>(false);
  const searchModal = useStore({
    isOpen: searchIsOpen,
    open: $(function () {
      searchIsOpen.value = true;
      document.documentElement.style.overflow = "hidden";
    }),
    close: $(function () {
      searchIsOpen.value = false;
      // Reverted back to auto, overlay is not supported in Safari, Firefox (https://caniuse.com/css-overflow-overlay)
      document.documentElement.style.overflow = "auto";
    }),
  });

  useContextProvider(SearchModalContext, searchModal);

  const upvotes = useSignal<ProjectUpvote[]>([]);
  useContextProvider(UpvotesContext, upvotes);

  const searchModalRef = useSignal<HTMLDialogElement>();
  const onKeyDown = $((e: QwikKeyboardEvent) => {
    if (e.key === "Escape") {
      searchModal.close();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      searchModal.open();
    }
  });
  const onClick = $((e: QwikMouseEvent) => {
    if (e.target === searchModalRef.value) {
      searchModal.close();
    }
  });

  useVisibleTask$(async () => {
    account.value = await AppwriteService.getAccount();

    if (account.value) {
      upvotes.value = await AppwriteService.listUserUpvotes(account.value.$id);
    }
  });

  const openedFilter = useSignal<string | null>(null);

  useTask$(() => {
    if (openedFilter.value === null) {
      for (const key of location.url.searchParams.keys()) {
        openedFilter.value = key;
        break;
      }
      if (openedFilter.value === null) {
        openedFilter.value = "platform";
      }
    }
  });

  const filters = [
    {
      id: "platform",
      name: "Platform",
      options: Config.platforms,
    },
    {
      id: "service",
      name: "Service",
      options: Config.services,
    },
    {
      id: "framework",
      name: "Framework",
      options: Config.frameworks,
    },
    {
      id: "uiLibrary",
      name: "UI Library",
      options: Config.uiLibraries,
    },
    {
      id: "useCase",
      name: "Use Case",
      options: Config.useCases,
    },
  ];

  const toggleFilter = $((id: string) => {
    if (openedFilter.value === id) {
      openedFilter.value = null;
    } else {
      openedFilter.value = id;
    }
  });

  function getOption(options: any, id: string) {
    return options[id];
  }

  const checkFilter = $((key: string, value: string) => {
    nav(`/search?${key}=${value}`, true);
  });

  const currentFilter = useComputed$(() => {
    const params = location.url.searchParams;

    for (const key of params.keys()) {
      return {
        key,
        value: params.get(key) ?? null,
      };
    }

    return {
      key: null,
      value: null,
    };
  });

  const sidebarPage = useComputed$(() => {
    return (
      location.url.pathname === "/" ||
      location.url.pathname.startsWith("/search")
    );
  });

  return (
    <>
      <div
        class={{
          "grid-with-side": sidebarPage.value,
          "u-flex-vertical u-full-screen-height": !sidebarPage.value,
          "theme-dark": theme.value === "dark",
        }}
      >
        <dialog
          open={searchIsOpen.value}
          style="position: fixed; z-index: 10000; background-color: #00000080; color: hsl(var(--search-color)); top: 0; left: 0; width: 100%; height: 100%;"
          ref={searchModalRef}
          document:onKeyDown$={onKeyDown}
          document:onClick$={onClick}
        >
          <Search />
        </dialog>
        <Header account={account} />
        <main class="main-content u-main-space-between">
          <div class="container hero-top-container">
            <Slot />
          </div>

          <Footer />
        </main>

        {(location.url.pathname === "/" ||
          location.url.pathname.startsWith("/search")) && (
          <aside class="main-side" style="padding-top: 0px;">
            <div class="side-nav">
              <div class="side-nav-main">
                <div class="drop-section" style="padding-top: 0.5rem;">
                  <div class="drop-list">
                    {filters.map((filter) => (
                      <div class="drop-list-item" key={filter.name}>
                        <button
                          onClick$={() => toggleFilter(filter.id)}
                          class="u-flex u-main-space-between u-cross-center u-width-full-line"
                        >
                          <h4 class="eyebrow-heading-3">{filter.name}</h4>
                          <span
                            class="icon-cheveron-down"
                            style={
                              openedFilter.value === filter.id
                                ? "transform: rotate(180deg);"
                                : ""
                            }
                          ></span>
                        </button>

                        {openedFilter.value === filter.id && (
                          <div class="u-flex-vertical u-gap-8 u-margin-block-start-8">
                            {Object.keys(filter.options).map((id) => (
                              <label
                                for={id}
                                key={id}
                                class={`u-flex u-cross-center u-gap-8 c-filter-card u-cursor-pointer ${
                                  currentFilter.value.key === filter.id &&
                                  currentFilter.value.value === id
                                    ? "c-menu-selected"
                                    : ""
                                }`}
                                style="border-radius: var(--border-radius-xsmall); padding: 0.5rem;"
                              >
                                <input
                                  checked={
                                    currentFilter.value.key === filter.id &&
                                    currentFilter.value.value === id
                                  }
                                  onChange$={() => checkFilter(filter.id, id)}
                                  id={id}
                                  type="radio"
                                  class="u-hide"
                                  style="width: 16px; height: 16px;"
                                />

                                {getOption(filter.options, id).icon && (
                                  <div
                                    class="u-flex u-cross-center u-main-center c-menu-icon"
                                    dangerouslySetInnerHTML={
                                      getOption(filter.options, id).icon
                                    }
                                  ></div>
                                )}

                                {getOption(filter.options, id).iconClass && (
                                  <span
                                    class={`c-menu-icon icon-${
                                      getOption(filter.options, id).iconClass
                                    }`}
                                    style="font-size: 1rem;"
                                    aria-hidden="true"
                                  ></span>
                                )}
                                <p>{getOption(filter.options, id).name}</p>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  );
});
