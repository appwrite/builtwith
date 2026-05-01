"use client";

import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Config } from "~/lib/config";

type FilterId = "platform" | "service" | "framework" | "uiLibrary" | "useCase";

const filters: { id: FilterId; name: string; options: Record<string, any> }[] =
  [
    { id: "platform", name: "Platform", options: Config.platforms },
    { id: "service", name: "Service", options: Config.services },
    { id: "framework", name: "Framework", options: Config.frameworks },
    { id: "uiLibrary", name: "UI Library", options: Config.uiLibraries },
    { id: "useCase", name: "Use Case", options: Config.useCases },
  ];

function pickInitialFilter(searchParams: URLSearchParams): FilterId {
  for (const key of searchParams.keys()) {
    if (filters.some((f) => f.id === key)) return key as FilterId;
  }
  return "platform";
}

export default function Sidebar() {
  const navigate = useNavigate();
  // Drive visibility off `state.matches` (updated in the same batch as the
  // route commit) instead of pathname, which either flips eagerly (location)
  // or lags one paint behind the commit (resolvedLocation, which is set in
  // the Transitioner's useLayoutEffect). The mismatch is what causes the
  // sidebar to pop in/out a beat after the page lands.
  const visible = useRouterState({
    select: (s) =>
      s.matches.some((m) => m.routeId === "/" || m.routeId === "/search"),
  });
  // searchStr is fine to read from `location` here — by the time `visible`
  // is true the matched route owns the URL, so location.searchStr matches.
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const searchParams = new URLSearchParams(searchStr);

  // Pick the initial open panel synchronously during the first render so
  // the matching `.filter-panel.is-open` class lands on first paint. If we
  // start from null and assign in a useEffect, the panel briefly mounts
  // collapsed and the open transition (grid-rows + staggered options) fires
  // after navigation lands — visible as a split-second delay when coming
  // back from a project page.
  const [opened, setOpened] = useState<FilterId | null>(() =>
    pickInitialFilter(searchParams),
  );

  if (!visible) return null;

  const currentKey = (() => {
    for (const key of searchParams.keys()) {
      if (filters.some((f) => f.id === key)) return key as FilterId;
    }
    return null;
  })();
  const currentValue = currentKey ? searchParams.get(currentKey) : null;

  const onSelect = (key: FilterId, value: string) => {
    const params = new URLSearchParams();
    params.set(key, value);
    navigate({ to: `/search?${params.toString()}` });
  };

  const toggle = (id: FilterId) =>
    setOpened((cur) => (cur === id ? null : id));

  return (
    <aside className="main-side" style={{ paddingTop: 0 }}>
      <div className="side-nav">
        <div className="side-nav-main">
          <div className="drop-section" style={{ paddingTop: "0.5rem" }}>
            <div className="drop-list">
              {filters.map((filter) => {
                const isOpen = opened === filter.id;
                return (
                  <div className="drop-list-item" key={filter.name}>
                    <button
                      type="button"
                      onClick={() => toggle(filter.id)}
                      aria-expanded={isOpen}
                      aria-controls={`filter-panel-${filter.id}`}
                      className="u-flex u-main-space-between u-cross-center u-width-full-line"
                    >
                      <h4 className="eyebrow-heading-3">{filter.name}</h4>
                      <span
                        className={`icon-cheveron-down filter-chevron${
                          isOpen ? " is-open" : ""
                        }`}
                      />
                    </button>
                    <div
                      id={`filter-panel-${filter.id}`}
                      className={`filter-panel${isOpen ? " is-open" : ""}`}
                    >
                      <div className="filter-panel-inner">
                        <div
                          className="u-flex-vertical u-gap-8 u-margin-block-start-8"
                          aria-hidden={!isOpen}
                        >
                          {Object.keys(filter.options).map((id, i) => {
                            const opt = filter.options[id];
                            const selected =
                              currentKey === filter.id && currentValue === id;
                            return (
                              <label
                                htmlFor={id}
                                key={id}
                                className={`filter-option u-flex u-cross-center u-gap-8 c-filter-card u-cursor-pointer${
                                  selected ? " c-menu-selected" : ""
                                }`}
                                style={
                                  {
                                    borderRadius:
                                      "var(--border-radius-xsmall)",
                                    padding: "0.5rem",
                                    "--filter-i": i,
                                  } as React.CSSProperties
                                }
                              >
                                <input
                                  checked={selected}
                                  onChange={() => onSelect(filter.id, id)}
                                  id={id}
                                  type="radio"
                                  className="u-hide"
                                  tabIndex={isOpen ? 0 : -1}
                                  style={{ width: 16, height: 16 }}
                                />
                                {opt.icon && (
                                  <div
                                    className="u-flex u-cross-center u-main-center c-menu-icon"
                                    dangerouslySetInnerHTML={{
                                      __html: opt.icon,
                                    }}
                                  />
                                )}
                                {opt.iconClass && (
                                  <span
                                    className={`c-menu-icon icon-${opt.iconClass}`}
                                    style={{ fontSize: "1rem" }}
                                    aria-hidden="true"
                                  />
                                )}
                                <p>{opt.name}</p>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
