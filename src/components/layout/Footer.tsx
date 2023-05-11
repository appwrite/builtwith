import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <footer class="main-footer u-cross-center">
      <div class="main-footer-start">
        <ul class="inline-links is-no-padding-first-and-last u-x-small">
          <li class="inline-links-item">
            <a
              href="https://appwrite.io/policy/terms"
              target="_blank"
              rel="noreferrer"
            >
              <span class="text">Terms</span>
            </a>
          </li>{" "}
          <li class="inline-links-item">
            <a
              href="https://appwrite.io/policy/privacy"
              target="_blank"
              rel="noreferrer"
            >
              <span class="text">Privacy</span>
            </a>
          </li>
          <li class="inline-links-item">
            <a
              href="https://appwrite.io/policy/cookies"
              target="_blank"
              rel="noreferrer"
            >
              <span class="text">Cookies</span>
            </a>
          </li>
        </ul>
      </div>{" "}
      <div class="main-footer-end">
        <ul class="inline-links is-no-padding-first-and-last u-x-small">
          <li class="inline-links-item">
            <div class="u-flex u-cross-center u-gap-8">
              <span class="icon-cloud "></span>{" "}
              <a
                class="text"
                href="https://cloud.appwrite.io/"
                target="_blank"
                rel="noreferrer"
              >
                Powered by Appwrite Cloud
              </a>
            </div>
          </li>
          <li class="inline-links-item u-flex u-gap-8">
            <a
              href="https://github.com/appwrite/built-with"
              target="_blank"
              rel="noreferrer"
            >
              <span
                class="icon-github"
                aria-hidden="true"
                aria-label="Appwrite on Github"
              ></span>
            </a>
            <a
              href="https://appwrite.io/discord"
              target="_blank"
              rel="noreferrer"
            >
              <span
                class="icon-discord"
                aria-hidden="true"
                aria-label="Appwrite on Discord"
              ></span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
});
