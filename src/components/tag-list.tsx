import Link from "next/link";

const tags = [
  {
    id: "demo-app",
    name: "Demo App",
    description: "Small application made to showcase specific features.",
  },
  {
    id: "starter",
    name: "Starter",
    description: "Templates ready to be used when making new project.",
  },
  {
    id: "saas",
    name: "SaaS",
    description: "Cool apps and side projects made for small scale.",
  },
  {
    id: "other",
    name: "Other",
    description: "Internet is infinite like space. Anything can be seen.",
  },
];

type Props = {
  totals: Record<string, number>;
};

export default function TagList({ totals }: Props) {
  return (
    <ul
      className="grid-box"
      style={
        {
          "--grid-gap": "1rem",
          "--grid-item-size": "16rem",
          "--grid-item-size-small-screens": "16rem",
        } as React.CSSProperties
      }
    >
      {tags.map((tag) => {
        const total = totals[tag.id] ?? 0;
        return (
          <li key={tag.id}>
            <Link href={`/search?useCase=${tag.id}`}>
              <div
                className="card u-flex-vertical u-cross-center u-main-center"
                style={{ padding: 0 }}
              >
                <div style={{ padding: "var(--p-card-padding)" }}>
                  <p className="eyebrow-heading-3 c-trim">{tag.name}</p>
                  <p className="u-margin-block-start-4 c-trim-2">
                    {tag.description}
                  </p>
                  <button
                    type="button"
                    className="button is-secondary u-margin-block-start-16"
                  >
                    <span className="text">
                      View {total} {total === 1 ? "Project" : "Projects"}
                    </span>
                  </button>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
