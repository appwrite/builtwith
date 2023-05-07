import {
  $,
  component$,
  createContextId,
  Signal,
  Slot,
  useComputed$,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
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

  const upvotes = useSignal<ProjectUpvote[]>([]);
  useContextProvider(UpvotesContext, upvotes);

  useVisibleTask$(async () => {
    account.value = await AppwriteService.getAccount();

    if (account.value) {
      upvotes.value = await AppwriteService.listUpvotes(account.value.$id);
    }
  });

  const openedFilter = useSignal("Service");
  const filters = [
    {
      name: "Service",
      options: Config.services,
    },
    {
      name: "Framework",
      options: Config.frameworks,
    },
    {
      name: "UI Library",
      options: Config.uiLibraries,
    },
    {
      name: "Use Case",
      options: Config.useCases,
    },
  ];

  const toggleFilter = $((name: string) => {
    if (openedFilter.value === name) {
      openedFilter.value = "";
    } else {
      openedFilter.value = name;
    }
  });

  function getOption(options: any, id: string) {
    return options[id];
  }

  return (
    <>
      <div class="grid-with-side">
        <Header account={account} />
        <main class="main-content">
          <div class="container hero-top-container">
            <Slot />
            <Footer />
          </div>
        </main>
        <aside class="main-side">
          <div
            class="u-flex u-flex-vertical u-gap-16"
            style="margin-left: 1rem"
          >
            {filters.map((filter) => (
              <div key={filter.name}>
                <button
                  onClick$={() => toggleFilter(filter.name)}
                  style="width: 100%;"
                  class="u-flex u-main-space-between u-cross-center"
                >
                  <h4 class="eyebrow-heading-3">{filter.name}</h4>
                  <span
                    class="icon-cheveron-down"
                    style={
                      openedFilter.value === filter.name
                        ? "transform: rotate(180deg);"
                        : ""
                    }
                  ></span>
                </button>

                {openedFilter.value === filter.name && (
                  <div class="u-flex-vertical u-gap-8 u-margin-block-start-8">
                    {Object.keys(filter.options).map((id) => (
                      <div
                        key={id}
                        class="u-flex u-cross-center u-gap-8 c-filter-card"
                        style="border-radius: var(--border-radius-xsmall); padding: 0.5rem;"
                      >
                        <input
                          type="checkbox"
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
});
