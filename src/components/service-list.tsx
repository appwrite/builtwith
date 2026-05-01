import { Link } from "@tanstack/react-router";

const services = [
  { id: "databases", name: "Databases", icon: "database" },
  { id: "authentication", name: "Authentication", icon: "user-group" },
  { id: "messaging", name: "Messaging", icon: "send" },
  { id: "storage", name: "Storage", icon: "archive" },
  { id: "functions", name: "Functions", icon: "lightning-bolt" },
  { id: "realtime", name: "Realtime", icon: "clock" },
];

export default function ServiceList() {
  return (
    <ul
      className="grid-box"
      style={
        {
          "--grid-gap": "1rem",
          "--grid-item-size": "12rem",
          "--grid-item-size-small-screens": "9rem",
        } as React.CSSProperties
      }
    >
      {services.map((service) => (
        <li key={service.id}>
          <Link
            to="/search"
            search={{ service: service.id }}
            className="card u-flex-vertical u-cross-center u-main-space u-overflow-hidden u-width-full-line"
            style={{ padding: 0 }}
          >
            <div
              className="c-service-container u-stretch u-flex u-cross-center u-main-center"
              style={{ minHeight: "8rem", padding: "1.5rem" }}
            >
              <span
                className={`icon-${service.icon}`}
                aria-hidden="true"
                style={{ fontSize: "3rem" }}
              />
            </div>
            <div style={{ padding: "var(--p-card-padding)" }}>
              <p
                className="u-text-center heading-level-5"
                style={{ fontSize: "1.1rem" }}
              >
                {service.name}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
