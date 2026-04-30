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
  const initialTheme =
    cookies().get("theme_buildwithappwrite")?.value === "dark"
      ? "dark"
      : "light";

  return (
    <html lang="en">
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Providers initialTheme={initialTheme}>
          <ThemedShell>
            <SearchModal />
            <Header />
            <main className="main-content u-main-space-between">
              <div className="container hero-top-container">{children}</div>
              <Footer />
            </main>
            <Sidebar />
          </ThemedShell>
        </Providers>
      </body>
    </html>
  );
}
