import { component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { Project } from "~/AppwriteService";
import { Config } from "~/Config";

export default component$((props: { project: Project }) => {
  const nav = useNavigate();

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

  return (
    <>
      <button
        onClick$={async () =>
          await nav(`/search?platform=${props.project.platform}`)
        }
      >
        <div class="tag is-secondary">
          <span
            class={`icon-${
              (Config.platforms as any)[props.project.platform].iconClass
            }`}
            aria-hidden="true"
          ></span>
          <span class="text">
            {(Config.platforms as any)[props.project.platform].name}
          </span>
        </div>
      </button>

      <button
        onClick$={async () =>
          await nav(`/search?useCase=${props.project.useCase}`)
        }
      >
        <div class="tag is-secondary">
          <span class="text">
            {(Config.useCases as any)[props.project.useCase].name}
          </span>
        </div>
      </button>

      {props.project.framework && (
        <button
          onClick$={async () =>
            await nav(`/search?framework=${props.project.framework}`)
          }
        >
          <div class="tag is-secondary">
            <span class="text">
              {(Config.frameworks as any)[props.project.framework].name}
            </span>
          </div>
        </button>
      )}

      {props.project.uiLibrary && (
        <button
          onClick$={async () =>
            await nav(`/search?uiLibrary=${props.project.uiLibrary}`)
          }
        >
          <div class="tag is-secondary">
            <span class="text">
              {(Config.uiLibraries as any)[props.project.uiLibrary].name}
            </span>
          </div>
        </button>
      )}

      {Object.keys(services).map((service) => (
        <button
          key={service}
          onClick$={async () => await nav(`/search?service=${service}`)}
        >
          {(services as any)[service].used && (
            <div class="tag is-secondary">
              <span
                class={`icon-${(services as any)[service].icon}`}
                aria-hidden="true"
              ></span>
              <span class="text">{(services as any)[service].name}</span>
            </div>
          )}
        </button>
      ))}
    </>
  );
});
