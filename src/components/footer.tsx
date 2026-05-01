export default function Footer() {
  return (
    <footer className="main-footer u-cross-center">
      <div className="main-footer-start">
        <ul className="inline-links is-no-padding-first-and-last u-x-small">
          <li className="inline-links-item">
            <a
              href="https://appwrite.io/policy/terms"
              target="_blank"
              rel="noreferrer"
            >
              <span className="text">Terms</span>
            </a>
          </li>
          <li className="inline-links-item">
            <a
              href="https://appwrite.io/policy/privacy"
              target="_blank"
              rel="noreferrer"
            >
              <span className="text">Privacy</span>
            </a>
          </li>
          <li className="inline-links-item">
            <a
              href="https://appwrite.io/cookies"
              target="_blank"
              rel="noreferrer"
            >
              <span className="text">Cookies</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="main-footer-end">
        <ul className="inline-links is-no-padding-first-and-last u-x-small">
          <li className="inline-links-item">
            <div className="u-flex u-cross-center u-gap-8">
              <span className="icon-cloud" />
              <a
                className="text"
                href="https://cloud.appwrite.io/"
                target="_blank"
                rel="noreferrer"
              >
                Powered by Appwrite Cloud
              </a>
            </div>
          </li>
          <li className="inline-links-item u-flex u-gap-8">
            <a
              href="https://github.com/appwrite/built-with"
              target="_blank"
              rel="noreferrer"
            >
              <span
                className="icon-github"
                aria-hidden="true"
                aria-label="Appwrite on Github"
              />
            </a>
            <a
              href="https://appwrite.io/discord"
              target="_blank"
              rel="noreferrer"
            >
              <span
                className="icon-discord"
                aria-hidden="true"
                aria-label="Appwrite on Discord"
              />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
