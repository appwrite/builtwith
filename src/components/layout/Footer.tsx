import {component$} from "@builder.io/qwik";

interface LinkItemProps {
  href: string;
  title?: string;
  spanClassName?: string;
  ariaLabel?: string;
}

export default component$(() => {
  return (
      <footer class="main-footer u-cross-center">
        <div class="main-footer-start">
          <PolicyLinks/>
        </div>
        {" "}
        <div class="main-footer-end">
          <SocialLinks/>
        </div>
      </footer>
  );
});

function PolicyLinks() {
  return (
      <ul class="inline-links is-no-padding-first-and-last u-x-small">
        <PolicyLink href="https://appwrite.io/policy/terms" title="Terms"/>
        <PolicyLink href="https://appwrite.io/policy/privacy" title="Privacy"/>
        <PolicyLink href="https://appwrite.io/policy/cookies" title="Cookies"/>
      </ul>
  );
}

function SocialLinks() {
  return (
      <ul class="inline-links is-no-padding-first-and-last u-x-small">
        <li class="inline-links-item">
          <div class="u-flex u-cross-center u-gap-8">
            <span class="icon-cloud "></span>
            <LinkItem href="https://cloud.appwrite.io/" title="Powered by Appwrite Cloud"/>
          </div>
        </li>
        <li class="inline-links-item u-flex u-gap-8">
          <LinkItem href="https://github.com/appwrite/built-with" spanClassName="icon-github"
                    ariaLabel="Appwrite on Github"/>
          <LinkItem href="https://appwrite.io/discord" spanClassName="icon-discord"
                    ariaLabel="Appwrite on Discord"/>
        </li>
      </ul>
  );
}

function PolicyLink({href, title}: LinkItemProps) {
  return (
      <li className="inline-links-item">
        <LinkItem href={href} title={title}/>
      </li>
  );
}

function LinkItem({href, title, spanClassName, ariaLabel}: LinkItemProps) {
  return (
      <a href={href} target="_blank" rel="noreferrer">
        {title && <span className="text">{title}</span>}
        {spanClassName && ariaLabel && (
            <span className={spanClassName} aria-hidden="true" aria-label={ariaLabel}></span>
        )}
      </a>
  );
}
