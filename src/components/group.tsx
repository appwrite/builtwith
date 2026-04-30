import Link from "next/link";
import type { ReactNode } from "react";

export default function Group({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="u-flex u-cross-center u-main-space-between">
        <h2 className="eyebrow-heading-2">{title}</h2>
        {href && (
          <Link href={href} className="button is-text">
            <span className="text">See All</span>
          </Link>
        )}
      </div>
      <div className="u-margin-block-start-16">{children}</div>
    </section>
  );
}
