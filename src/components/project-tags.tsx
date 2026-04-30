import Link from "next/link";
import { Config } from "~/lib/config";
import type { Project } from "~/lib/types";

export default function ProjectTags({ project }: { project: Project }) {
  const services = {
    databases: { used: project.hasDatabases, name: "Databases", icon: "database" },
    authentication: {
      used: project.hasAuthentication,
      name: "Authentication",
      icon: "user-group",
    },
    messaging: { used: project.hasMessaging, name: "Messaging", icon: "send" },
    storage: { used: project.hasStorage, name: "Storage", icon: "archive" },
    functions: {
      used: project.hasFunctions,
      name: "Functions",
      icon: "lightning-bolt",
    },
    realtime: { used: project.hasRealtime, name: "Realtime", icon: "clock" },
  } as const;

  const platforms = Config.platforms as Record<string, { name: string; iconClass: string }>;
  const useCases = Config.useCases as Record<string, { name: string }>;
  const frameworks = Config.frameworks as Record<string, { name: string }>;
  const uiLibraries = Config.uiLibraries as Record<string, { name: string }>;

  const platform = platforms[project.platform];

  return (
    <>
      {platform && (
        <Link
          href={`/search?platform=${project.platform}`}
          className="tag is-secondary"
        >
          {platform.iconClass && (
            <span className={`icon-${platform.iconClass}`} aria-hidden="true" />
          )}
          {platform.name && <span className="text">{platform.name}</span>}
        </Link>
      )}

      {useCases[project.useCase] && (
        <Link
          href={`/search?useCase=${project.useCase}`}
          className="tag is-secondary"
        >
          <span className="text">{useCases[project.useCase].name}</span>
        </Link>
      )}

      {project.framework && frameworks[project.framework] && (
        <Link
          href={`/search?framework=${project.framework}`}
          className="tag is-secondary"
        >
          <span className="text">{frameworks[project.framework].name}</span>
        </Link>
      )}

      {project.uiLibrary && uiLibraries[project.uiLibrary] && (
        <Link
          href={`/search?uiLibrary=${project.uiLibrary}`}
          className="tag is-secondary"
        >
          <span className="text">{uiLibraries[project.uiLibrary].name}</span>
        </Link>
      )}

      {(Object.keys(services) as Array<keyof typeof services>)
        .filter((service) => services[service].used)
        .map((service) => (
          <Link
            key={service}
            href={`/search?service=${service}`}
            className="tag is-secondary"
          >
            <span
              className={`icon-${services[service].icon}`}
              aria-hidden="true"
            />
            <span className="text">{services[service].name}</span>
          </Link>
        ))}
    </>
  );
}
