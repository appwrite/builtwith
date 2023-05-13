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
import Footer from "~/components/layout/Footer";
import Header from "~/components/layout/Header";

export const UpvotesContext = createContextId<Signal<ProjectUpvote[]>>(
  "app.upvotes-context"
);

export const AccountContext = createContextId<Signal<null | Models.User<any>>>(
  "app.account-context"
);

export const useAccount = routeLoader$(async () => {
  return {
    account: await AppwriteService.getAccount(),
  };
});

export default component$(() => {
  const account = useSignal<null | Models.User<any>>(null);
  useContextProvider(AccountContext, account);

  const location = useLocation();
  const nav = useNavigate();

  const upvotes = useSignal<ProjectUpvote[]>([]);
  useContextProvider(UpvotesContext, upvotes);

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

  return (
    <>
      <div
        class={
          location.url.pathname === "/" ||
          location.url.pathname.startsWith("/search")
            ? "grid-with-side"
            : "u-flex-vertical u-full-screen-height"
        }
      >
        <Header account={account} />
        <main class="main-content u-flex u-flex-vertical u-main-space-between">
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
                          style="width: 100%;"
                          class="u-flex u-main-space-between u-cross-center"
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
                                class="u-flex u-cross-center u-gap-8 c-filter-card u-cursor-pointer"
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
                                  style="width: 16px; height: 16px;"
                                />

                                {getOption(filter.options, id).icon && (
                                  <div
                                    class="u-flex u-cross-center u-main-center"
                                    dangerouslySetInnerHTML={
                                      getOption(filter.options, id).icon
                                    }
                                  ></div>
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
