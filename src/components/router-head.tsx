/* eslint-disable qwik/jsx-key */
import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const loc = useLocation();
  const head = useDocumentHead();

  return (
    <>
      <title>{head.title ?? "Built with Appwrite"}</title>

      <link rel="canonical" href={loc.url.href} />
      <link rel="og:url" href={loc.url.href} />
      <link rel="twitter:url" href={loc.url.href} />

      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content="https://builtwith.appwrite.io/cover.png"
      />
      <meta
        property="og:image:alt"
        content="Built with: Expore popular projects built with Appwrite"
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="675" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="builtwith.appwrite.io" />
      <meta property="twitter:site" content="@appwrite" />

      {head.links.map((l) => (
        <link {...l} />
      ))}

      {head.meta.map((m) => (
        <meta {...m} />
      ))}
    </>
  );
});
