import { component$ } from "@builder.io/qwik";
import Service from "./Service";
import Databases from "../icons/Databases";
import Auth from "../icons/Auth";
import Storage from "../icons/Storage";
import Functions from "../icons/Functions";
import Realtime from "../icons/Realtime";

export default component$(() => {
  return (
    <ul
      class="grid-box"
      style="--grid-gap:1rem; --grid-item-size:12rem; --grid-item-size-small-screens:9rem;"
    >
      <li>
        <Service id="databases" name="Databases">
          <Databases />
        </Service>
      </li>
      <li>
        <Service id="authentication" name="Authentication">
          <Auth />
        </Service>
      </li>
      <li>
        <Service id="storage" name="Storage">
          <Storage />
        </Service>
      </li>
      <li>
        <Service id="functions" name="Functions">
          <Functions />
        </Service>
      </li>
      <li>
        <Service id="realtime" name="Realtime">
          <Realtime />
        </Service>
      </li>
    </ul>
  );
});
