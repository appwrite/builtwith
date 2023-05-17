import type { Signal } from "@builder.io/qwik";
import { useContext } from "@builder.io/qwik";
import { $, component$, useSignal } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { Models } from "appwrite";
import { AppwriteService } from "~/AppwriteService";
import { SearchModalContext } from "~/routes/layout";

export default component$(
  (props: { account: Signal<null | Models.User<any>> }) => {
    const nav = useNavigate();

    const searchModal = useContext(SearchModalContext);

    const links = [
      { name: "Home", url: "/" },
      { name: "Timeline", url: "/search?sort=latest" },
    ];

    const isDark = useSignal(true);
    const isMenuOpened = useSignal(false);

    const toggleMenu = $(() => {
      isMenuOpened.value = !isMenuOpened.value;
    });

    const toggleTheme = $(() => {
      if (isDark.value) {
        document.body.classList.remove("theme-dark");
      } else {
        document.body.classList.add("theme-dark");
      }

      isDark.value = document.body.classList.contains("theme-dark");
    });

    const signOut = $(async () => {
      await AppwriteService.signOut();
      props.account.value = null;
    });

    return (
      <>
        <header class="main-header u-padding-inline-end-0 u-flex-shrink-0">
          <button
            onClick$={toggleMenu}
            class="button is-text is-only-icon is-only-mobile nav-btn"
            aria-label="Open Menu"
          >
            {isMenuOpened.value ? (
              <span aria-hidden="true" class="icon-x"></span>
            ) : (
              <span aria-hidden="true" class="icon-menu"></span>
            )}
          </button>
          <button
            onClick$={async () => await nav("/")}
            class="u-flex u-cross-center u-gap-8 u-margin-inline-end-8"
          >
            <svg
              width="116"
              height="30"
              viewBox="0 0 116 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M115.394 16.2281C115.394 20.7653 111.716 24.4434 107.178 24.4434C105.07 24.4434 103.148 23.6497 101.693 22.3453C104.023 21.2964 105.645 18.9546 105.645 16.2341C105.645 13.5099 104.019 11.1657 101.685 10.1188C103.14 8.80967 105.066 8.01288 107.178 8.01288C111.716 8.01288 115.394 11.691 115.394 16.2281Z"
                fill="#F02E65"
              />
              <path
                d="M103.893 9.67066C98.8475 5.85779 91.5658 8.93631 90.7864 15.2122C90.4242 18.129 91.6478 21.017 93.9952 22.7858C99.0439 26.5953 106.324 23.5114 107.099 17.2349C107.458 14.3218 106.236 11.4385 103.893 9.67058V9.67066ZM102.98 10.8812C107.096 13.9873 106.306 20.3843 101.558 22.396C99.354 23.3296 96.8194 23.0167 94.909 21.5751C90.7926 18.469 91.5824 12.0719 96.331 10.0604C98.5346 9.12687 101.069 9.43968 102.98 10.8812Z"
                fill="#F02E65"
              />
              <path
                d="M99.1643 13.3858C99.1546 13.41 99.0288 13.9034 98.8937 14.4887C98.7532 15.0739 98.5307 15.9977 98.4052 16.5441C98.1632 17.5453 98.0181 18.2031 98.0181 18.29C98.0181 18.3141 98.1682 18.3337 98.3517 18.3337H98.6857L98.8354 17.6661C98.9226 17.3035 99.1162 16.4715 99.2708 15.8186C99.4257 15.1657 99.6141 14.3725 99.6868 14.0531C99.7593 13.7339 99.8319 13.444 99.8465 13.41C99.861 13.3665 99.7786 13.3522 99.5271 13.3522C99.3384 13.3522 99.1739 13.3665 99.1643 13.3858ZM96.567 15.4799L96.1221 15.9637L96.2528 16.1185C96.3252 16.2054 96.5238 16.4232 96.6929 16.6023L97.0025 16.9309H97.8829L97.4667 16.4812C97.2393 16.2396 97.0507 16.0072 97.0507 15.9783C97.0507 15.9444 97.2248 15.7269 97.4379 15.4946C97.6505 15.2578 97.8247 15.0544 97.8247 15.0303C97.8247 15.0108 97.641 14.9964 97.4186 14.9964H97.017L96.567 15.4799ZM99.9526 15.0254C99.9526 15.04 100.035 15.1317 100.136 15.2333C100.514 15.6106 100.78 15.93 100.765 15.9926C100.756 16.0267 100.572 16.2539 100.349 16.4908L99.948 16.9309H100.398L100.848 16.9262L101.258 16.4763C101.486 16.225 101.67 16.0022 101.67 15.9734C101.67 15.9493 101.476 15.7219 101.234 15.4657L100.799 14.9964H100.378C100.141 14.9964 99.9526 15.0108 99.9526 15.0254Z"
                fill="#F02E65"
              />
              <path
                d="M3.96547 13.08C4.3388 12.4267 4.88547 11.8933 5.60547 11.48C6.32547 11.0667 7.14547 10.86 8.06547 10.86C9.05214 10.86 9.9388 11.0933 10.7255 11.56C11.5121 12.0267 12.1321 12.6867 12.5855 13.54C13.0388 14.38 13.2655 15.36 13.2655 16.48C13.2655 17.5867 13.0388 18.5733 12.5855 19.44C12.1321 20.3067 11.5055 20.98 10.7055 21.46C9.9188 21.94 9.0388 22.18 8.06547 22.18C7.1188 22.18 6.28547 21.9733 5.56547 21.56C4.8588 21.1467 4.32547 20.62 3.96547 19.98V22H2.14547V7.2H3.96547V13.08ZM11.4055 16.48C11.4055 15.6533 11.2388 14.9333 10.9055 14.32C10.5721 13.7067 10.1188 13.24 9.54547 12.92C8.98547 12.6 8.36547 12.44 7.68547 12.44C7.0188 12.44 6.3988 12.6067 5.82547 12.94C5.26547 13.26 4.81214 13.7333 4.46547 14.36C4.13214 14.9733 3.96547 15.6867 3.96547 16.5C3.96547 17.3267 4.13214 18.0533 4.46547 18.68C4.81214 19.2933 5.26547 19.7667 5.82547 20.1C6.3988 20.42 7.0188 20.58 7.68547 20.58C8.36547 20.58 8.98547 20.42 9.54547 20.1C10.1188 19.7667 10.5721 19.2933 10.9055 18.68C11.2388 18.0533 11.4055 17.32 11.4055 16.48ZM25.3811 11.04V22H23.5611V20.38C23.2144 20.94 22.7278 21.38 22.1011 21.7C21.4878 22.0067 20.8078 22.16 20.0611 22.16C19.2078 22.16 18.4411 21.9867 17.7611 21.64C17.0811 21.28 16.5411 20.7467 16.1411 20.04C15.7544 19.3333 15.5611 18.4733 15.5611 17.46V11.04H17.3611V17.22C17.3611 18.3 17.6344 19.1333 18.1811 19.72C18.7278 20.2933 19.4744 20.58 20.4211 20.58C21.3944 20.58 22.1611 20.28 22.7211 19.68C23.2811 19.08 23.5611 18.2067 23.5611 17.06V11.04H25.3811ZM29.3941 9.26C29.0474 9.26 28.7541 9.14 28.5141 8.9C28.2741 8.66 28.1541 8.36667 28.1541 8.02C28.1541 7.67333 28.2741 7.38 28.5141 7.14C28.7541 6.9 29.0474 6.78 29.3941 6.78C29.7274 6.78 30.0074 6.9 30.2341 7.14C30.4741 7.38 30.5941 7.67333 30.5941 8.02C30.5941 8.36667 30.4741 8.66 30.2341 8.9C30.0074 9.14 29.7274 9.26 29.3941 9.26ZM30.2741 11.04V22H28.4541V11.04H30.2741ZM35.1959 7.2V22H33.3759V7.2H35.1959ZM40.5178 12.54V19C40.5178 19.5333 40.6311 19.9133 40.8578 20.14C41.0845 20.3533 41.4778 20.46 42.0378 20.46H43.3778V22H41.7378C40.7245 22 39.9645 21.7667 39.4578 21.3C38.9511 20.8333 38.6978 20.0667 38.6978 19V12.54H37.2778V11.04H38.6978V8.28H40.5178V11.04H43.3778V12.54H40.5178ZM60.783 10.92L57.543 22H54.523L52.503 14.26L50.483 22H47.443L44.183 10.92H47.023L48.983 19.36L51.103 10.92H54.063L56.143 19.34L58.103 10.92H60.783ZM63.718 9.6C63.2246 9.6 62.8113 9.44667 62.478 9.14C62.158 8.82 61.998 8.42667 61.998 7.96C61.998 7.49333 62.158 7.10667 62.478 6.8C62.8113 6.48 63.2246 6.32 63.718 6.32C64.2113 6.32 64.618 6.48 64.938 6.8C65.2713 7.10667 65.438 7.49333 65.438 7.96C65.438 8.42667 65.2713 8.82 64.938 9.14C64.618 9.44667 64.2113 9.6 63.718 9.6ZM65.098 10.92V22H62.298V10.92H65.098ZM71.1244 13.22V18.58C71.1244 18.9533 71.211 19.2267 71.3844 19.4C71.571 19.56 71.8777 19.64 72.3044 19.64H73.6044V22H71.8444C69.4844 22 68.3044 20.8533 68.3044 18.56V13.22H66.9844V10.92H68.3044V8.18H71.1244V10.92H73.6044V13.22H71.1244ZM81.8583 10.76C82.6983 10.76 83.4449 10.9467 84.0983 11.32C84.7516 11.68 85.2583 12.22 85.6183 12.94C85.9916 13.6467 86.1783 14.5 86.1783 15.5V22H83.3783V15.88C83.3783 15 83.1583 14.3267 82.7183 13.86C82.2783 13.38 81.6783 13.14 80.9183 13.14C80.1449 13.14 79.5316 13.38 79.0783 13.86C78.6383 14.3267 78.4183 15 78.4183 15.88V22H75.6183V7.2H78.4183V12.3C78.7783 11.82 79.2583 11.4467 79.8583 11.18C80.4583 10.9 81.1249 10.76 81.8583 10.76Z"
                fill="#F02E65"
              />
            </svg>
          </button>
          <div class="logo is-not-mobile">
            <ul class="buttons-list is-with-padding">
              {/* <li></li> */}

              {links.map((link) => (
                <li
                  key={link.name}
                  class="buttons-list-item u-padding-inline-0"
                >
                  <button
                    onClick$={async () => await nav(link.url)}
                    class="button is-text"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div class="logo is-only-mobile"></div>
          <div
            class={`main-header-end u-margin-inline-end-16 menu-right TODO-MENU-RIGHT-ONLY-IF-SIGNED-IN`}
          >
            <ul class="buttons-list is-with-padding">
              <li class="buttons-list-item">
                <button
                  class="input-text u-flex u-cross-center u-padding-inline-8 u-border-radius-8"
                  style="padding-block: 0.32rem;"
                  id="search-btn"
                  aria-label="search"
                  onClick$={() => {
                    searchModal.open();
                  }}
                >
                  <span class="icon-search" aria-hidden="true"></span>
                  <span
                    class="text u-margin-inline-start-4 is-not-mobile"
                    aria-hidden="true"
                  >
                    search
                  </span>
                  <div class="u-flex u-cross-center u-gap-4 u-margin-inline-start-32 is-not-mobile">
                    <kbd id="meta" class="kbd">
                      ⌘
                    </kbd>
                    <kbd class="kbd">K</kbd>
                  </div>
                </button>
              </li>
              <li class="buttons-list-item u-padding-inline-0">
                <div class="tooltip" aria-label="Toggle Dark Theme">
                  {isDark.value ? (
                    <>
                      <button
                        class="button is-only-icon is-text"
                        onClick$={toggleTheme}
                        aria-label="Replace to Dark Mode Theme"
                      >
                        <span class="icon-sun" aria-hidden="true"></span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        class="button is-only-icon is-text"
                        onClick$={toggleTheme}
                        aria-label="Replace to Light Mode Theme"
                      >
                        <span class="icon-moon" aria-hidden="true"></span>
                      </button>
                    </>
                  )}

                  <span class="tooltip-popup is-bottom" role="tooltip">
                    Toggle Dark Theme
                  </span>
                </div>
              </li>
              <li class="buttons-list-item u-padding-inline-0">
                <button
                  onClick$={async () => await nav("/submit-project")}
                  class="button is-text"
                >
                  <span class="text">Submit</span>
                </button>
              </li>
              {props.account.value === null ? (
                <li class="buttons-list-item u-flex u-cross-center">
                  <button
                    onClick$={() => {
                      AppwriteService.signIn();
                    }}
                    class="button is-secondary"
                  >
                    <span class="icon-github" aria-hidden="true"></span>
                    <span class="text">Sign In</span>
                  </button>
                </li>
              ) : (
                <>
                  <li class="buttons-list-item u-padding-inline-0">
                    <button onClick$={signOut} class="button is-text">
                      <svg
                        class="is-not-desktop"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style="transform: rotate(90deg)"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.59961 20.4C3.59961 19.7373 4.13687 19.2 4.79961 19.2H19.1996C19.8624 19.2 20.3996 19.7373 20.3996 20.4C20.3996 21.0628 19.8624 21.6 19.1996 21.6H4.79961C4.13687 21.6 3.59961 21.0628 3.59961 20.4ZM7.55108 8.04855C7.08245 7.57992 7.08245 6.82013 7.55108 6.3515L11.1511 2.7515C11.3761 2.52645 11.6813 2.40002 11.9996 2.40002C12.3179 2.40002 12.6231 2.52645 12.8481 2.7515L16.4481 6.3515C16.9168 6.82012 16.9168 7.57992 16.4481 8.04855C15.9795 8.51718 15.2197 8.51718 14.7511 8.04855L13.1996 6.49708L13.1996 15.6C13.1996 16.2628 12.6623 16.8 11.9996 16.8C11.3369 16.8 10.7996 16.2628 10.7996 15.6L10.7996 6.49708L9.24814 8.04855C8.77951 8.51718 8.01971 8.51718 7.55108 8.04855Z"
                          fill="currentColor"
                        />
                      </svg>
                      <p class="is-only-desktop">Sign Out</p>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </header>

        {isMenuOpened.value && (
          <aside class="main-side" style="display: block; padding-top: 0;">
            <nav class="side-nav">
              <div class="side-nav-main">
                <section class="drop-section">
                  <ul class="drop-list">
                    {links.map((link) => (
                      <li key={link.name} class="drop-list-item">
                        <button
                          onClick$={async () => await nav(link.url)}
                          class="drop-button u-capitalize u-small u-bold"
                          aria-current="page"
                        >
                          <span>{link.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </nav>
          </aside>
        )}
      </>
    );
  }
);
