import type { Signal } from "@builder.io/qwik";
import { useContext } from "@builder.io/qwik";
import { $, component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Models } from "appwrite";
import { AppwriteService } from "~/AppwriteService";
import { SearchModalContext, ThemeContext } from "~/routes/layout";
import Cookies from "js-cookie";

export default component$(
  (props: { account: Signal<null | Models.User<any>> }) => {
    const searchModal = useContext(SearchModalContext);

    const links = [
      { name: "Home", url: "/" },
      { name: "Timeline", url: "/search?sort=latest" },
    ];

    const theme = useContext(ThemeContext);
    const isMenuOpened = useSignal(false);

    const toggleMenu = $(() => {
      isMenuOpened.value = !isMenuOpened.value;
    });

    const setTheme = $((newTheme: "light" | "dark") => {
      theme.value = newTheme;
      Cookies.set("theme_buildwithappwrite", newTheme, {
        sameSite: "strict",
        expires: 365,
      });
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
          <Link
            href="/"
            class="u-flex u-cross-center u-gap-8 u-margin-inline-end-8"
          >
            {theme.value === "dark" ? (
              <>
                <svg
                  width="150"
                  height="25"
                  viewBox="0 0 647 105"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_9_6)">
                    <g filter="url(#filter0_b_9_6)">
                      <path
                        d="M35.4788 11.1309C54.8209 11.1309 65.5954 20.4775 65.5954 35.1463C65.5954 45.5314 59.8836 51.8922 51.3159 54.8779C60.9221 56.6953 69.3599 62.9263 69.3599 76.0374C69.3599 92.1342 57.9364 102 36.3874 102H3.28514V11.1309H35.4788ZM14.5789 91.7448H36.3874C50.4072 91.7448 57.8066 85.9032 57.8066 76.5567C57.8066 66.3014 49.888 60.7195 36.3874 60.7195H14.5789V91.7448ZM14.5789 50.5941H35.998C47.6812 50.5941 54.3016 45.1419 54.3016 35.9252C54.3016 26.8383 47.811 21.3861 35.998 21.3861H14.5789V50.5941ZM78.2085 72.6623V35.7954H88.8532V72.0132C88.8532 85.7734 95.0842 93.0429 106.118 93.0429C118.191 93.0429 125.46 83.8262 125.46 68.8977V35.7954H136.105V102H126.888L125.46 93.1727C121.566 98.1056 115.205 102.779 104.301 102.779C89.7619 102.779 78.2085 94.6007 78.2085 72.6623ZM147.76 35.7954H158.405V102H147.76V35.7954ZM146.332 17.7514C146.332 13.7272 149.318 10.8713 153.212 10.8713C157.106 10.8713 160.092 13.7272 160.092 17.7514C160.092 21.7756 157.106 24.6315 153.212 24.6315C149.318 24.6315 146.332 21.7756 146.332 17.7514ZM170.131 11.1309H180.776V102H170.131V11.1309ZM197.436 84.7349V45.5314H185.493V35.7954H197.436V17.2321H208.08V35.7954H225.216V45.5314H208.08V84.6051C208.08 90.187 210.027 92.264 215.739 92.264H226.254V102H214.701C201.979 102 197.436 96.418 197.436 84.7349ZM257.51 35.7954H268.674L285.16 89.6678L302.555 35.7954H312.42L328.907 89.6678L346.172 35.7954H356.946L334.878 102H323.195L307.228 52.8009L290.612 102H278.929L257.51 35.7954ZM362.428 35.7954H373.073V102H362.428V35.7954ZM361 17.7514C361 13.7272 363.986 10.8713 367.88 10.8713C371.774 10.8713 374.76 13.7272 374.76 17.7514C374.76 21.7756 371.774 24.6315 367.88 24.6315C363.986 24.6315 361 21.7756 361 17.7514ZM389.732 84.7349V45.5314H377.789V35.7954H389.732V17.2321H400.377V35.7954H417.512V45.5314H400.377V84.6051C400.377 90.187 402.324 92.264 408.036 92.264H418.551V102H406.997C394.276 102 389.732 96.418 389.732 84.7349ZM424.919 11.1309H435.563V46.6997C439.458 40.4687 446.208 35.0165 457.372 35.0165C472.171 35.0165 484.243 43.1947 484.243 65.1331V102H473.598V65.7822C473.598 52.022 466.978 44.7525 455.554 44.7525C443.222 44.7525 435.563 53.9692 435.563 68.8977V102H424.919V11.1309Z"
                        fill="#EDEDF0"
                      />
                    </g>
                    <path
                      d="M647 79.1129V105.484H579.786C560.203 105.484 543.105 94.8779 533.957 79.1129C532.627 76.821 531.463 74.4165 530.487 71.9208C528.57 67.0302 527.366 61.7824 527 56.3068V49.177C527.079 47.9568 527.204 46.7461 527.368 45.5498C527.702 43.0949 528.207 40.6928 528.871 38.3578C535.15 16.2205 555.567 0 579.786 0C604.004 0 624.419 16.2205 630.698 38.3578H601.958C597.24 31.1417 589.073 26.371 579.786 26.371C570.498 26.371 562.331 31.1417 557.613 38.3578C556.175 40.5513 555.059 42.9703 554.328 45.5498C553.679 47.8369 553.333 50.2487 553.333 52.7419C553.333 60.3008 556.521 67.1141 561.634 71.9208C566.372 76.3823 572.759 79.1129 579.786 79.1129H647Z"
                      fill="#FD366E"
                    />
                    <path
                      d="M647 45.5499V71.9208H597.937C603.05 67.1141 606.239 60.3008 606.239 52.742C606.239 50.2487 605.892 47.8369 605.243 45.5499H647Z"
                      fill="#FD366E"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_b_9_6"
                      x="-15.9464"
                      y="-8.36024"
                      width="519.421"
                      height="130.371"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feGaussianBlur
                        in="BackgroundImageFix"
                        stdDeviation="9.61577"
                      />
                      <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_9_6"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_9_6"
                        result="shape"
                      />
                    </filter>
                    <clipPath id="clip0_9_6">
                      <rect width="647" height="105" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </>
            ) : (
              <>
                <svg
                  width="150"
                  height="25"
                  viewBox="0 0 647 105"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_6_20)">
                    <g filter="url(#filter0_b_6_20)">
                      <path
                        d="M3.28514 100V9.13092H35.4788C44.9984 9.13092 52.3977 11.2945 57.6768 15.6216C62.9558 19.8621 65.5954 25.7037 65.5954 33.1463C65.5954 43.0121 60.8356 49.5893 51.3159 52.8779C56.595 53.9164 60.9221 56.1665 64.2972 59.6282C67.6724 63.0898 69.3599 67.8929 69.3599 74.0374C69.3599 82.1724 66.5041 88.5332 60.7923 93.1199C55.1671 97.7066 47.0321 100 36.3874 100H3.28514ZM35.998 19.3861H14.5789V48.5941H35.998C41.7963 48.5941 46.2965 47.2959 49.4986 44.6997C52.7006 42.1034 54.3016 38.5119 54.3016 33.9252C54.3016 29.3385 52.7006 25.7903 49.4986 23.2805C46.383 20.6843 41.8829 19.3861 35.998 19.3861ZM36.3874 58.7195H14.5789V89.7448H36.3874C43.3108 89.7448 48.5899 88.4034 52.2246 85.7206C55.9459 83.0378 57.8066 79.3165 57.8066 74.5567C57.8066 69.4507 55.9459 65.5563 52.2246 62.8735C48.5033 60.1041 43.2243 58.7195 36.3874 58.7195ZM125.46 66.8977V33.7954H136.105V100H126.888L125.46 91.1727C120.441 97.5768 113.388 100.779 104.301 100.779C96.4256 100.779 90.108 98.3557 85.3482 93.5094C80.5884 88.663 78.2085 81.0473 78.2085 70.6623V33.7954H88.8532V70.0132C88.8532 76.85 90.3244 82.0858 93.2668 85.7206C96.2958 89.2688 100.58 91.0429 106.118 91.0429C112.176 91.0429 116.893 88.8794 120.268 84.5523C123.73 80.2252 125.46 74.3403 125.46 66.8977ZM158.145 20.6843C156.847 21.9824 155.202 22.6315 153.212 22.6315C151.222 22.6315 149.577 21.9824 148.279 20.6843C146.981 19.3861 146.332 17.7418 146.332 15.7514C146.332 13.7609 146.981 12.1166 148.279 10.8185C149.577 9.52036 151.222 8.8713 153.212 8.8713C155.202 8.8713 156.847 9.52036 158.145 10.8185C159.443 12.1166 160.092 13.7609 160.092 15.7514C160.092 17.7418 159.443 19.3861 158.145 20.6843ZM147.76 100V33.7954H158.405V100H147.76ZM170.131 100V9.13092H180.776V100H170.131ZM197.436 82.7349V43.5314H185.493V33.7954H197.436V15.2321H208.08V33.7954H225.216V43.5314H208.08V82.6051C208.08 85.3744 208.643 87.3649 209.768 88.5765C210.893 89.7015 212.883 90.264 215.739 90.264H226.254V100H214.701C208.47 100 204.013 98.6153 201.33 95.846C198.734 93.0766 197.436 88.7063 197.436 82.7349ZM278.929 100L257.51 33.7954H268.674L285.16 87.6678L302.555 33.7954H312.42L328.907 87.6678L346.172 33.7954H356.946L334.878 100H323.195L307.228 50.8009L290.612 100H278.929ZM372.813 20.6843C371.515 21.9824 369.871 22.6315 367.88 22.6315C365.89 22.6315 364.245 21.9824 362.947 20.6843C361.649 19.3861 361 17.7418 361 15.7514C361 13.7609 361.649 12.1166 362.947 10.8185C364.245 9.52036 365.89 8.8713 367.88 8.8713C369.871 8.8713 371.515 9.52036 372.813 10.8185C374.111 12.1166 374.76 13.7609 374.76 15.7514C374.76 17.7418 374.111 19.3861 372.813 20.6843ZM362.428 100V33.7954H373.073V100H362.428ZM389.732 82.7349V43.5314H377.789V33.7954H389.732V15.2321H400.377V33.7954H417.512V43.5314H400.377V82.6051C400.377 85.3744 400.939 87.3649 402.064 88.5765C403.19 89.7015 405.18 90.264 408.036 90.264H418.551V100H406.997C400.766 100 396.309 98.6153 393.627 95.846C391.03 93.0766 389.732 88.7063 389.732 82.7349ZM457.372 33.0165C465.42 33.0165 471.911 35.4397 476.844 40.286C481.777 45.1324 484.243 52.7481 484.243 63.1331V100H473.598V63.7822C473.598 56.9454 472.041 51.7528 468.925 48.2046C465.81 44.5699 461.353 42.7525 455.554 42.7525C449.41 42.7525 444.52 44.916 440.886 49.2431C437.337 53.5702 435.563 59.4551 435.563 66.8977V100H424.919V9.13092H435.563V44.6997C440.41 36.9109 447.679 33.0165 457.372 33.0165Z"
                        fill="#19191D"
                      />
                    </g>
                    <path
                      d="M647 79.1129V105.484H579.786C560.203 105.484 543.105 94.8779 533.957 79.1129C532.627 76.821 531.463 74.4165 530.487 71.9208C528.57 67.0302 527.366 61.7824 527 56.3068V49.177C527.079 47.9568 527.204 46.7461 527.368 45.5498C527.702 43.0949 528.207 40.6928 528.871 38.3578C535.15 16.2205 555.567 0 579.786 0C604.004 0 624.419 16.2205 630.698 38.3578H601.958C597.24 31.1417 589.073 26.371 579.786 26.371C570.498 26.371 562.331 31.1417 557.613 38.3578C556.175 40.5513 555.059 42.9703 554.328 45.5498C553.679 47.8369 553.333 50.2487 553.333 52.7419C553.333 60.3008 556.521 67.1141 561.634 71.9208C566.372 76.3823 572.759 79.1129 579.786 79.1129H647Z"
                      fill="#FD366E"
                    />
                    <path
                      d="M647 45.5499V71.9208H597.937C603.05 67.1141 606.239 60.3008 606.239 52.742C606.239 50.2487 605.892 47.8369 605.243 45.5499H647Z"
                      fill="#FD366E"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_b_6_20"
                      x="-15.9464"
                      y="-10.3602"
                      width="519.421"
                      height="130.371"
                      filterUnits="userSpaceOnUse"
                      color-interpolation-filters="sRGB"
                    >
                      <feFlood flood-opacity="0" result="BackgroundImageFix" />
                      <feGaussianBlur
                        in="BackgroundImageFix"
                        stdDeviation="9.61577"
                      />
                      <feComposite
                        in2="SourceAlpha"
                        operator="in"
                        result="effect1_backgroundBlur_6_20"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_backgroundBlur_6_20"
                        result="shape"
                      />
                    </filter>
                    <clipPath id="clip0_6_20">
                      <rect width="647" height="105" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </>
            )}
          </Link>
          <div class="logo is-not-mobile">
            <ul class="buttons-list is-with-padding">
              {/* <li></li> */}

              {links.map((link) => (
                <li
                  key={link.name}
                  class="buttons-list-item u-padding-inline-0"
                >
                  <Link href={link.url} class="button is-text">
                    {link.name}
                  </Link>
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
                  {theme.value === "dark" ? (
                    <>
                      <button
                        class="button is-only-icon is-text"
                        onClick$={() => setTheme("light")}
                        aria-label="Replace to Dark Mode Theme"
                      >
                        <span class="icon-sun" aria-hidden="true"></span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        class="button is-only-icon is-text"
                        onClick$={() => setTheme("dark")}
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
                    <Link href="/submit-project" class="button is-text">
                      <span class="text">Submit</span>
                    </Link>
                  </li>
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
          /* style="display: block;" required over u-block for specifity */
          <aside class="main-side" style="display: block; padding-top: 0;">
            <nav class="side-nav">
              <div class="side-nav-main">
                <section class="drop-section">
                  <ul class="drop-list">
                    {links.map((link) => (
                      <li key={link.name} class="drop-list-item">
                        <Link
                          href={link.url}
                          class="drop-button u-capitalize u-small u-bold"
                          aria-current="page"
                        >
                          <span>{link.name}</span>
                        </Link>
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
