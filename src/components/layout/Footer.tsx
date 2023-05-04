import { $, component$, useSignal } from "@builder.io/qwik";

export default component$(() => {
  return (
    <footer class="main-footer u-margin-block-start-48" style="margin-inline: 0px;">
      <div class="main-footer-start">
        <ul class="inline-links is-no-padding-first-and-last u-x-small">
          <li class="inline-links-item">
            <a href="#">
              <span class="text">Terms</span>
            </a>
          </li>
          <li class="inline-links-item">
            <a href="#">
              <span class="text">Privacy</span>
            </a>
          </li>
        </ul>
      </div>
      <div class="main-footer-end">
        <ul class="inline-links is-no-padding-first-and-last u-x-small">
          <li class="inline-links-item">
            <span class="text">ⓒ 2023 Appwrite. All rights reserved.</span>
          </li>
        </ul>
      </div>
    </footer>
  );
});
