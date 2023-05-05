import { component$ } from "@builder.io/qwik";
import Tag from "./Tag";

export default component$(() => {
  return (
    <ul
      class="grid-box"
      style="--grid-gap:1rem; --grid-item-size:16rem; --grid-item-size-small-screens:8rem;"
    >
      <li>
        <Tag name="Stater" />
      </li>
      <li>
        <Tag name="Ecommerce" />
      </li>
      <li>
        <Tag name="AI" />
      </li>
      <li>
        <Tag name="Blog" />
      </li>
    </ul>
  );
});
