import { component$ } from "@builder.io/qwik";
import Tag from "./Tag";

export default component$(
  (props: {
    startersTotal: number;
    demoAppsTotal: number;
    othersTotal: number;
    docsTotal: number;
  }) => {
    return (
      <ul
        class="grid-box"
        style="--grid-gap:1rem; --grid-item-size:16rem; --grid-item-size-small-screens:16rem;"
      >
        <li>
          <Tag
            id="demo-app"
            total={props.demoAppsTotal}
            name="Demo App"
            description="Small application made to showcase specific features."
          />
        </li>
        <li>
          <Tag
            id="starter"
            total={props.startersTotal}
            name="Stater"
            description="Templates ready to be used when making new project."
          />
        </li>
        <li>
          <Tag
            id="saas"
            total={props.docsTotal}
            name="SaaS"
            description="Cool apps and side projects made for small scale."
          />
        </li>
        <li>
          <Tag
            id="other"
            total={props.othersTotal}
            name="Other"
            description="Internet is infinite like space. Anything can be seen."
          />
        </li>
      </ul>
    );
  }
);
