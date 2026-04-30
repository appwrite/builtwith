"use client";

import Link from "next/link";
import { useState } from "react";
import { ClientAppwrite } from "~/lib/appwrite-client";
import { useApp } from "./providers";
import Logo from "./logo";

const links = [
  { name: "Home", url: "/" },
  { name: "Timeline", url: "/search?sort=latest" },
];

export default function Header() {
  const { theme, setTheme, account, refreshAccount, openSearch } = useApp();
  const [open, setOpen] = useState(false);

  const onSignOut = async () => {
    await ClientAppwrite.signOut();
    await refreshAccount();
  };

  return (
    <>
      <header className="main-header u-padding-inline-end-0 u-flex-shrink-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="button is-text is-only-icon is-only-mobile nav-btn"
          aria-label="Open Menu"
        >
          <span aria-hidden="true" className={open ? "icon-x" : "icon-menu"} />
        </button>
        <Link
          href="/"
          className="u-flex u-cross-center u-gap-8 u-margin-inline-end-8"
          aria-label="Built with Appwrite"
        >
          <Logo />
        </Link>
        <div className="logo is-not-mobile">
          <ul className="buttons-list is-with-padding">
            {links.map((link) => (
              <li
                key={link.name}
                className="buttons-list-item u-padding-inline-0"
              >
                <Link href={link.url} className="button is-text">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="logo is-only-mobile" />
        <div className="main-header-end u-margin-inline-end-16 menu-right">
          <ul className="buttons-list is-with-padding">
            <li className="buttons-list-item">
              <button
                type="button"
                className="input-text u-flex u-cross-center u-padding-inline-8 u-border-radius-8"
                style={{ paddingBlock: "0.32rem" }}
                aria-label="Search"
                onClick={openSearch}
              >
                <span className="icon-search" aria-hidden="true" />
                <span
                  className="text u-margin-inline-start-4 is-not-mobile"
                  aria-hidden="true"
                >
                  search
                </span>
                <div className="u-flex u-cross-center u-gap-4 u-margin-inline-start-32 is-not-mobile">
                  <kbd className="kbd">⌘</kbd>
                  <kbd className="kbd">K</kbd>
                </div>
              </button>
            </li>
            <li className="buttons-list-item u-padding-inline-0">
              <button
                className="button is-only-icon is-text"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle Dark Theme"
              >
                <span
                  className={theme === "dark" ? "icon-sun" : "icon-moon"}
                  aria-hidden="true"
                />
              </button>
            </li>
            {account === null ? (
              <li className="buttons-list-item u-flex u-cross-center">
                <button
                  onClick={() => ClientAppwrite.signIn()}
                  className="button is-secondary"
                >
                  <span className="icon-github" aria-hidden="true" />
                  <span className="text">Sign In</span>
                </button>
              </li>
            ) : (
              <>
                <li className="buttons-list-item u-padding-inline-0">
                  <Link href="/submit-project" className="button is-text">
                    <span className="text">Submit</span>
                  </Link>
                </li>
                <li className="buttons-list-item u-padding-inline-0">
                  <button onClick={onSignOut} className="button is-text">
                    <p>Sign Out</p>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>

      {open && (
        <aside
          className="main-side"
          style={{ display: "block", paddingTop: 0 }}
        >
          <nav className="side-nav">
            <div className="side-nav-main">
              <section className="drop-section">
                <ul className="drop-list">
                  {links.map((link) => (
                    <li key={link.name} className="drop-list-item">
                      <Link
                        href={link.url}
                        className="drop-button u-capitalize u-small u-bold"
                      >
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </nav>
        </aside>
      )}
    </>
  );
}
