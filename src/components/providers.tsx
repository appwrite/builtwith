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

export default function Providers({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [account, setAccount] =
    useState<Models.User<Models.Preferences> | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const t = readCookie();
    if (t && t !== theme) setThemeState(t);
    ClientAppwrite.getAccount().then(setAccount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
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
