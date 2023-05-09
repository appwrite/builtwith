import { component$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head";

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

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/favicon.png" />

        <link
          rel="stylesheet"
          href="https://unpkg.com/@tailwindcss/typography@0.4.1/dist/typography.css"
        />
        <RouterHead />
      </head>
      <body lang="en" class="theme-dark">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
