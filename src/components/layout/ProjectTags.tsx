import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Project } from "~/AppwriteService";
import { Config } from "~/Config";

export default component$((props: { project: Project }) => {
  const services = {
    databases: {
      used: props.project.hasDatabases,
      name: "Databases",
      icon: "database",
    },
    authentication: {
      used: props.project.hasAuthentication,
      name: "Authentication",
      icon: "user-group",
    },
    storage: {
      used: props.project.hasStorage,
      name: "Storage",
      icon: "archive",
    },
    functions: {
      used: props.project.hasFunctions,
      name: "Functions",
      icon: "lightning-bolt",
    },
    realtime: {
      used: props.project.hasRealtime,
      name: "Realtime",
      icon: "clock",
    },
  };

  const platform = (Config.platforms as any)[props.project.platform];

  return (
    <>
      {platform && (
        <Link
          href={`/search?platform=${props.project.platform}`}
          class="tag is-secondary"
        >
          {platform.iconClass && (
            <span
              class={`icon-${platform.iconClass}`}
              aria-hidden="true"
            ></span>
          )}
          {platform.name && <span class="text">{platform.name}</span>}
        </Link>
      )}

      <Link
        href={`/search?useCase=${props.project.useCase}`}
        class="tag is-secondary"
      >
        <span class="text">
          {(Config.useCases as any)[props.project.useCase].name}
        </span>
      </Link>

      {props.project.framework && (
        <Link
          href={`/search?framework=${props.project.framework}`}
          class="tag is-secondary"
        >
          <span class="text">
            {(Config.frameworks as any)[props.project.framework].name}
          </span>
        </Link>
      )}

      {props.project.uiLibrary && (
        <Link
          href={`/search?uiLibrary=${props.project.uiLibrary}`}
          class="tag is-secondary"
        >
          <span class="text">
            {(Config.uiLibraries as any)[props.project.uiLibrary].name}
          </span>
        </Link>
      )}

      {Object.keys(services)
        .filter((service) => (services as any)[service].used)
        .map((service) => (
          <Link
            key={service}
            href={`/search?service=${service}`}
            class="tag is-secondary"
          >
            <span
              class={`icon-${(services as any)[service].icon}`}
              aria-hidden="true"
            ></span>
            <span class="text">{(services as any)[service].name}</span>
          </Link>
        ))}
    </>
  );
});
