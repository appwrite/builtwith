import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
  useLocation,
} from "@builder.io/qwik-city";

import "./global.css";
import "@appwrite.io/pink";
import "@appwrite.io/pink-icons";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */

  const location = useLocation();

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/favicon.png" />

        <title>Built with Appwrite</title>
        <meta
          name="description"
          content="Explore popular projects built with Appwrite."
        />

        <meta property="og:url" content={location.url.href} />
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
        <meta property="twitter:url" content={location.url.href} />
        <meta name="twitter:title" content="Built with Appwrite" />
        <meta
          name="twitter:description"
          content="Explore popular projects built with Appwrite."
        />
        <meta
          name="twitter:image"
          content="https://builtwith.appwrite.io/cover.png"
        />
      </head>
      <body lang="en" class="theme-dark">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
