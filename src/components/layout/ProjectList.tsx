import { component$ } from "@builder.io/qwik";
import Project from "./Project";

export default component$(() => {
  return (
    <ul
      class="grid-box"
      style="--grid-gap:1rem; --grid-item-size:22rem; --grid-item-size-small-screens:8rem;"
    >
      <li>
        <Project />
      </li> <li>
        <Project />
      </li> <li>
        <Project />
      </li>
    </ul>
  );
});
