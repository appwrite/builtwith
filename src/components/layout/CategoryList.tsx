import { component$ } from "@builder.io/qwik";
import Category from "./Category";

export default component$(() => {
  return (
    <ul
      class="grid-box"
      style="--grid-gap:1rem; --grid-item-size:16rem; --grid-item-size-small-screens:8rem;"
    >
      <li>
        <Category />
      </li> <li>
        <Category />
      </li> <li>
        <Category />
      </li> <li>
        <Category />
      </li>
    </ul>
  );
});
