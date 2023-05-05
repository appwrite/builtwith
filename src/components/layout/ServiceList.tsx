import { component$ } from "@builder.io/qwik";
import Service from "./Service";

export default component$(() => {
  return (
    <ul
      class="grid-box"
      style="--grid-gap:1rem; --grid-item-size:12rem; --grid-item-size-small-screens:11rem;"
    >
      <li>
        <Service name="Databases" image="/images/services-db.png" />
      </li>
      <li>
        <Service name="Authentication" image="/images/services-auth.png" />
      </li>
      <li>
        <Service name="Storage" image="/images/services-storage.png" />
      </li>
      <li>
        <Service name="Functions" image="/images/services-functions.png" />
      </li>
      <li>
        <Service name="Realtime" image="/images/services-realtime.png" />
      </li>
    </ul>
  );
});
