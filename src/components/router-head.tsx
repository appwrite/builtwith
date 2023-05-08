import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const loc = useLocation();

  return (
    <>
      <link rel="canonical" href={loc.url.href} />
      <link rel="og:url" href={loc.url.href} />
      <link rel="twitter:url" href={loc.url.href} />

      <title>Built with Appwrite</title>
      <meta
        name="description"
        content="Explore popular projects built with Appwrite."
      />

      <meta property="og:type" content="website" />
      <meta property="og:title" content="Built with Appwrite" />
      <meta
        property="og:description"
        content="Explore popular projects built with Appwrite."
      />
      <meta
        property="og:image"
        content="https://builtwith.appwrite.io/cover.png"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="builtwith.appwrite.io" />

      <meta name="twitter:title" content="Built with Appwrite" />
      <meta
        name="twitter:description"
        content="Explore popular projects built with Appwrite."
      />
      <meta
        name="twitter:image"
        content="https://builtwith.appwrite.io/cover.png"
      />
    </>
  );
});
