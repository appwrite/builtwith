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

export const metadata: Metadata = {
  title: "Built with Appwrite",
  description: "Explore popular projects built with Appwrite.",
  icons: { icon: "/logo.svg" },
  manifest: "/manifest.json",
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
