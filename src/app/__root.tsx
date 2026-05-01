/// <reference types="vite/client" />

import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import "@appwrite.io/pink";
import "@appwrite.io/pink-icons/dist/icon.css";
import Header from "~/components/header";
import Footer from "~/components/footer";
import Sidebar from "~/components/sidebar";
import Providers from "~/components/providers";
import ThemedShell from "~/components/themed-shell";
import SearchModal from "~/components/search-modal";
import ToastProvider from "~/components/toast";
import { SITE_URL } from "~/lib/site";
import appCss from "./globals.css?url";

const SITE_NAME = "Built with Appwrite";
const SITE_DESCRIPTION =
  "Discover the projects, tools, and apps the community is building with Appwrite.";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?framework={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_NAME },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "application-name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: SITE_NAME },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: "/cover.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Built with Appwrite" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@appwrite" },
      { name: "twitter:creator", content: "@appwrite" },
      { name: "twitter:title", content: SITE_NAME },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: "/cover.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/logo.svg" },
      { rel: "manifest", href: "/manifest.json" },
      {
        rel: "preload",
        href: "https://fonts.appwrite.io/aeonik-pro/AeonikPro-Regular.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
    ],
    scripts: [
      { children: themeBootstrap },
      {
        type: "application/ld+json",
        children: JSON.stringify(websiteJsonLd),
      },
    ],
  }),
  component: RootComponent,
});

// Runs synchronously before hydration. If the user has no cookie, follow
// prefers-color-scheme so the page paints in the right theme on first
// paint instead of flashing light then switching.
const themeBootstrap = `
    (function () {
      try {
        var c = document.cookie.match(/(?:^|; )theme_buildwithappwrite=(dark|light)/);
        var theme = c ? c[1] : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.dataset.themePreboot = theme;
        document.documentElement.classList.toggle('theme-dark', theme === 'dark');
        document.documentElement.style.colorScheme = theme;
      } catch (e) {}
    })();
  `.replace(/\s+/g, " ");

function RootComponent() {
  return (
    <RootDocument>
      <Providers initialTheme="light">
        <ToastProvider>
          <ThemedShell>
            <SearchModal />
            <Header />
            <main className="main-content u-main-space-between">
              <div className="container hero-top-container">
                <Outlet />
              </div>
              <Footer />
            </main>
            <Sidebar />
          </ThemedShell>
        </ToastProvider>
      </Providers>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
