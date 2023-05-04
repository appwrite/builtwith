import { $, component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
   <a href="#">
     <div
      class="card u-flex-vertical u-cross-center u-main-center"
      style="padding: 0px;"
    >
      <div class="object-square">
        <img
          style="border-radius: var(--border-radius-medium); border-bottom-left-radius: 0px !important; border-bottom-right-radius: 0px !important;"
          src="/service.png"
          alt=""
        />
      </div>

      <div style="padding: var(--p-card-padding)">
      <p class="u-text-center eyebrow-heading-3">Databases</p>
      </div>
    </div>
   </a>
  );
});
