import { component$ } from "@builder.io/qwik";
import Project from "./Project";

export default component$(() => {
  return (
    <div class="u-flex u-flex-wrap u-flex-vertical-mobile u-gap-8">
      <div style="flex-basis: calc(33.33% - 0.5rem)">
        <Project />
      </div>
      <div style="flex-basis: calc(33.33% - 0.5rem)">
        <Project />
      </div>
      <div style="flex-basis: calc(33.33% - 0.5rem)">
        <Project />
      </div>
    </div>
  );
});
