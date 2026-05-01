"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Models } from "appwrite";
import { ClientAppwrite } from "~/lib/appwrite-client";

type Theme = "light" | "dark";

type AppContext = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  account: Models.User<Models.Preferences> | null;
  refreshAccount: () => Promise<void>;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
};

const Ctx = createContext<AppContext | null>(null);

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp outside Providers");
  return ctx;
}

const COOKIE = "theme_buildwithappwrite";

const readCookie = (): Theme | null => {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )theme_buildwithappwrite=([^;]+)/);
  return m ? (m[1] === "dark" ? "dark" : "light") : null;
};

const readSystem = (): Theme => {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function Providers({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [hasUserChoice, setHasUserChoice] = useState(false);
  const [account, setAccount] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const cookieTheme = readCookie();
    if (cookieTheme) {
      setHasUserChoice(true);
      if (cookieTheme !== theme) setThemeState(cookieTheme);
    } else {
      setThemeState(readSystem());
    }

    const completeAndLoadAccount = async () => {
      // Token-flow OAuth callback: ?userId=...&secret=... means GitHub just
      // redirected back. Exchange the token for a real session on our own
      // origin so the SDK stores it locally and we don't depend on a
      // third-party cookie from cloud.appwrite.io.
      const url = new URL(window.location.href);
      const userId = url.searchParams.get("userId");
      const secret = url.searchParams.get("secret");
      if (userId && secret) {
        await ClientAppwrite.completeOAuthSession(userId, secret);
        url.searchParams.delete("userId");
        url.searchParams.delete("secret");
        window.history.replaceState({}, "", url.toString());
      }
      const me = await ClientAppwrite.getAccount();
      setAccount(me);
    };
    completeAndLoadAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow live OS changes only while the user hasn't made an explicit choice.
  useEffect(() => {
    if (hasUserChoice) return;
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? "dark" : "light");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [hasUserChoice]);

  // Keep <html data-theme-preboot> in sync with the active theme. The inline
  // bootstrap script sets this attribute once on first paint; without this
  // sync, [data-theme-preboot="dark"] CSS still applies dark colors to
  // .grid-with-side after the user toggles to light, leaving the body dark
  // while the wrapper has no .theme-dark class.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.themePreboot = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setHasUserChoice(true);
    document.cookie = `${COOKIE}=${t}; path=/; max-age=31536000; samesite=strict`;
  }, []);

  const refreshAccount = useCallback(async () => {
    setAccount(await ClientAppwrite.getAccount());
  }, []);

  const openSearch = useCallback(() => {
    setSearchOpen(true);
    document.documentElement.style.overflow = "hidden";
  }, []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    document.documentElement.style.overflow = "auto";
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => {
          const next = !v;
          document.documentElement.style.overflow = next ? "hidden" : "auto";
          return next;
        });
      } else if (e.key === "Escape" && searchOpen) {
        e.preventDefault();
        setSearchOpen(false);
        document.documentElement.style.overflow = "auto";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      account,
      refreshAccount,
      searchOpen,
      openSearch,
      closeSearch,
    }),
    [theme, setTheme, account, refreshAccount, searchOpen, openSearch, closeSearch]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
