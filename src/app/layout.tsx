import type { Metadata } from "next";
import { cookies } from "next/headers";
import "@appwrite.io/pink";
import "@appwrite.io/pink-icons/dist/icon.css";
import "./globals.css";
import Header from "~/components/header";
import Footer from "~/components/footer";
import Sidebar from "~/components/sidebar";
import Providers from "~/components/providers";
import ThemedShell from "~/components/themed-shell";
import SearchModal from "~/components/search-modal";
import ToastProvider from "~/components/toast";
import { SITE_URL } from "~/lib/site";

const SITE_NAME = "Built with Appwrite";
const SITE_DESCRIPTION =
  "Discover the projects, tools, and apps the community is building with Appwrite.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | Built with Appwrite",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  icons: { icon: "/logo.svg" },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      { url: "/cover.png", width: 1200, height: 630, alt: "Built with Appwrite" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@appwrite",
    creator: "@appwrite",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/cover.png"],
  },
};

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieTheme = cookies().get("theme_buildwithappwrite")?.value;
  const initialTheme: "light" | "dark" =
    cookieTheme === "dark" ? "dark" : "light";

  // Runs synchronously before hydration. If the user has no cookie, follow
  // prefers-color-scheme so the page paints in the right theme on first
  // paint instead of flashing light then switching.
  const themeBootstrap = `
    (function () {
      try {
        var c = document.cookie.match(/(?:^|; )theme_buildwithappwrite=(dark|light)/);
        var theme = c ? c[1] : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.dataset.themePreboot = theme;
        document.documentElement.style.colorScheme = theme;
      } catch (e) {}
    })();
  `.replace(/\s+/g, " ");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="https://fonts.appwrite.io/aeonik-pro/AeonikPro-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Inter is loaded via `@import` in globals.css; no <link rel="stylesheet"> here. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <Providers initialTheme={initialTheme}>
          <ToastProvider>
            <ThemedShell>
              <SearchModal />
              <Header />
              <main className="main-content u-main-space-between">
                <div className="container hero-top-container">{children}</div>
                <Footer />
              </main>
              <Sidebar />
            </ThemedShell>
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
