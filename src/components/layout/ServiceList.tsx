import { component$ } from "@builder.io/qwik";
import Service from "./Service";

export default component$(() => {
  return (
    <ul
      class="grid-box"
      style="--grid-gap:1rem; --grid-item-size:12rem; --grid-item-size-small-screens:8rem;"
    >
      <li>
        <Service
          id="databases"
          name="Databases"
          image="/images/services-db.png"
        />
      </li>
      <li>
        <Service
          id="authentication"
          name="Authentication"
          image="/images/services-auth.png"
        />
      </li>
      <li>
        <Service
          id="storage"
          name="Storage"
          image="/images/services-storage.png"
        />
      </li>
      <li>
        <Service
          id="functions"
          name="Functions"
          image="/images/services-functions.png"
        />
      </li>
      <li>
        <Service
          id="realtime"
          name="Realtime"
          image="/images/services-realtime.png"
        />
      </li>
    </ul>
  );
});
