"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { ClientAppwrite } from "~/lib/appwrite-client";
import { Config } from "~/lib/config";
import { useApp } from "~/components/providers";
import { XIcon } from "~/components/icons";

const SERVICE_KEYS = [
  "databases",
  "authentication",
  "messaging",
  "storage",
  "functions",
  "realtime",
] as const;
type ServiceKey = (typeof SERVICE_KEYS)[number];

const SERVICE_LABELS: Record<ServiceKey, string> = {
  databases: "Databases",
  authentication: "Authentication",
  messaging: "Messaging",
  storage: "Storage",
  functions: "Functions",
  realtime: "Realtime",
};

const SERVICE_ICONS: Record<ServiceKey, string> = {
  databases: "database",
  authentication: "user-group",
  messaging: "send",
  storage: "archive",
  functions: "lightning-bolt",
  realtime: "clock",
};

type UrlKey =
  | "website"
  | "github"
  | "twitter"
  | "article"
  | "googlePlay"
  | "appStore"
  | "linux"
  | "macOs"
  | "windows";

const URL_FIELDS: { key: UrlKey; label: string; icon: string; placeholder: string }[] = [
  { key: "website", label: "Website", icon: "external-link", placeholder: "https://your-app.com" },
  { key: "github", label: "GitHub", icon: "github", placeholder: "https://github.com/owner/repo" },
  { key: "twitter", label: "X", icon: "x-brand", placeholder: "https://x.com/handle" },
  { key: "article", label: "Article / Blog", icon: "book-open", placeholder: "https://blog.example.com/post" },
  { key: "googlePlay", label: "Google Play", icon: "google", placeholder: "https://play.google.com/..." },
  { key: "appStore", label: "App Store (iOS)", icon: "apple", placeholder: "https://apps.apple.com/..." },
  { key: "macOs", label: "App Store (macOS)", icon: "apple", placeholder: "https://apps.apple.com/..." },
  { key: "windows", label: "Microsoft Store", icon: "microsoft", placeholder: "https://apps.microsoft.com/..." },
  { key: "linux", label: "Linux", icon: "linux", placeholder: "https://snapcraft.io/..." },
];

export default function SubmitForm() {
  const { account } = useApp();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [framework, setFramework] = useState("");
  const [uiLibrary, setUiLibrary] = useState("");
  const [useCase, setUseCase] = useState("");
  const [urls, setUrls] = useState<Record<UrlKey, string>>({
    website: "",
    github: "",
    twitter: "",
    article: "",
    googlePlay: "",
    appStore: "",
    linux: "",
    macOs: "",
    windows: "",
  });
  const [services, setServices] = useState<Record<ServiceKey, boolean>>({
    databases: false,
    authentication: false,
    messaging: false,
    storage: false,
    functions: false,
    realtime: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const acceptDropped = (f: File | undefined | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please drop an image file (PNG, JPG, or WebP).");
      return;
    }
    setError("");
    setFile(f);
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(f);
      fileInputRef.current.files = dt.files;
    }
  };

  // Drag depth counter handles nested elements firing dragenter/leave —
  // without it, hovering over child nodes flickers the visual state.
  const onDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!Array.from(e.dataTransfer.types).includes("Files")) return;
    dragDepth.current += 1;
    setIsDragOver(true);
  };
  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragOver(false);
  };
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    dragDepth.current = 0;
    setIsDragOver(false);
    acceptDropped(e.dataTransfer.files?.[0]);
  };

  const onUrl = (key: UrlKey) => (e: ChangeEvent<HTMLInputElement>) =>
    setUrls((u) => ({ ...u, [key]: e.target.value }));

  const onService = (k: ServiceKey) => () =>
    setServices((s) => ({ ...s, [k]: !s[k] }));

  const taglineCount = tagline.length;
  const descriptionCount = description.length;
  const taglineMax = 120;
  const descriptionMax = 2000;

  const usedServices = useMemo(
    () => SERVICE_KEYS.filter((s) => services[s]),
    [services]
  );

  const reset = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setName("");
    setTagline("");
    setDescription("");
    setFramework("");
    setUiLibrary("");
    setUseCase("");
    setPlatform("");
    setUrls({
      website: "",
      github: "",
      twitter: "",
      article: "",
      googlePlay: "",
      appStore: "",
      linux: "",
      macOs: "",
      windows: "",
    });
    setServices({
      databases: false,
      authentication: false,
      messaging: false,
      storage: false,
      functions: false,
      realtime: false,
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!account) {
      setError("Please sign in first.");
      return;
    }

    setIsLoading(true);
    try {
      if (
        !file ||
        !useCase ||
        !name.trim() ||
        !tagline.trim() ||
        !description.trim() ||
        !platform
      ) {
        throw new Error("Please fill in all required fields.");
      }

      if (usedServices.length === 0) {
        throw new Error("Pick at least one Appwrite service used.");
      }

      const { $id: fileId } = await ClientAppwrite.uploadThumbnail(file);

      const data = {
        platform,
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        framework,
        uiLibrary,
        useCase,
        urlWebsite: urls.website,
        urlTwitter: urls.twitter,
        urlGitHub: urls.github,
        urlArticle: urls.article,
        urlGooglePlay: urls.googlePlay,
        urlAppStore: urls.appStore,
        urlLinux: urls.linux,
        urlMacOs: urls.macOs,
        urlWindows: urls.windows,
        services: usedServices,
        fileId,
      };

      let response;
      try {
        response = await ClientAppwrite.submitProject(data);
      } catch (submitErr) {
        await ClientAppwrite.deleteThumbnail(fileId);
        throw submitErr;
      }
      setSuccess(response.msg ?? "Submitted! We'll review shortly.");
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="card u-text-center" style={{ padding: "3rem" }}>
        <h2 className="heading-level-3">Sign in to submit a project</h2>
        <p className="u-margin-block-start-12">
          You need a GitHub-linked account to submit your project.
        </p>
        <button
          type="button"
          onClick={() => ClientAppwrite.signIn()}
          className="button is-primary u-margin-block-start-24"
        >
          <span className="icon-github" aria-hidden="true" />
          <span className="text">Sign in with GitHub</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="u-flex-vertical u-gap-32 submit-form">
      <header className="u-flex-vertical u-gap-8">
        <p className="eyebrow-heading-3">Submit your project</p>
        <h1 className="heading-level-2">Tell us what you built</h1>
        <p className="u-margin-block-start-4" style={{ fontSize: "1rem" }}>
          Submissions are reviewed manually before going live. Take a minute
          to fill in clear, accurate details — good descriptions get accepted
          faster.
        </p>
      </header>

      {/* Section: Thumbnail */}
      <section className="card submit-section">
        <div className="u-flex-vertical u-gap-8 u-margin-block-end-16">
          <h3 className="heading-level-5">Thumbnail</h3>
          <p className="u-x-small">
            16:9 image, ideally 1280×720. Used as the project cover everywhere.
          </p>
        </div>

        <label
          htmlFor="thumb"
          className={`submit-thumb-drop${isDragOver ? " is-drag-over" : ""}`}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Thumbnail preview" />
          ) : (
            <div className="u-flex-vertical u-cross-center u-gap-8">
              <span
                className="icon-cloud-upload"
                aria-hidden="true"
                style={{ fontSize: "2rem" }}
              />
              <p>
                <strong>Click to upload</strong> or drop an image here
              </p>
              <p className="u-x-small">PNG / JPG / WebP, up to 10 MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            id="thumb"
            type="file"
            accept="image/*"
            onChange={onFile}
            className="u-hide"
            required
          />
        </label>
        {file && (
          <button
            type="button"
            onClick={() => {
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="button is-text u-margin-block-start-12"
          >
            <span className="icon-trash" aria-hidden="true" />
            <span className="text">Remove image</span>
          </button>
        )}
      </section>

      {/* Section: About */}
      <section className="card submit-section">
        <div className="u-flex-vertical u-gap-8 u-margin-block-end-16">
          <h3 className="heading-level-5">About the project</h3>
          <p className="u-x-small">
            Short and specific reads better than long and vague.
          </p>
        </div>

        <div className="submit-grid">
          <div className="form-item">
            <label className="label is-required" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="input-text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Notes"
              maxLength={80}
              required
            />
          </div>

          <div className="form-item">
            <label className="label is-required" htmlFor="tagline">
              Tagline
              <span className="u-x-small u-margin-inline-start-8">
                {taglineCount}/{taglineMax}
              </span>
            </label>
            <input
              id="tagline"
              className="input-text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="One sentence describing what this is."
              maxLength={taglineMax}
              required
            />
          </div>

          <div className="form-item submit-grid-full">
            <label className="label is-required" htmlFor="description">
              Description
              <span className="u-x-small u-margin-inline-start-8">
                Markdown supported · {descriptionCount}/{descriptionMax}
              </span>
            </label>
            <textarea
              id="description"
              className="input-text"
              rows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={"## What it does\n\nA full description, features, screenshots."}
              maxLength={descriptionMax}
              required
            />
          </div>
        </div>
      </section>

      {/* Section: Classification */}
      <section className="card submit-section">
        <div className="u-flex-vertical u-gap-8 u-margin-block-end-16">
          <h3 className="heading-level-5">Classification</h3>
          <p className="u-x-small">
            Helps people find your project on the right filter.
          </p>
        </div>

        <div className="submit-grid">
          <div className="form-item">
            <label className="label is-required" htmlFor="platform">
              Platform
            </label>
            <div className="select u-width-full-line">
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="">Select option</option>
                {Object.keys(Config.platforms).map((id) => (
                  <option key={id} value={id}>
                    {(Config.platforms as Record<string, { name: string }>)[id].name}
                  </option>
                ))}
              </select>
              <span className="icon-cheveron-down" aria-hidden="true" />
            </div>
          </div>

          <div className="form-item">
            <label className="label is-required" htmlFor="usecase">
              Use case
            </label>
            <div className="select u-width-full-line">
              <select
                id="usecase"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
              >
                <option value="">Select option</option>
                {Object.keys(Config.useCases).map((id) => (
                  <option key={id} value={id}>
                    {(Config.useCases as Record<string, { name: string }>)[id].name}
                  </option>
                ))}
              </select>
              <span className="icon-cheveron-down" aria-hidden="true" />
            </div>
          </div>

          <div className="form-item">
            <label className="label" htmlFor="framework">
              Framework
            </label>
            <div className="select u-width-full-line">
              <select
                id="framework"
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
              >
                <option value="">Optional</option>
                {Object.keys(Config.frameworks).map((id) => (
                  <option key={id} value={id}>
                    {(Config.frameworks as Record<string, { name: string }>)[id].name}
                  </option>
                ))}
              </select>
              <span className="icon-cheveron-down" aria-hidden="true" />
            </div>
          </div>

          <div className="form-item">
            <label className="label" htmlFor="ui">
              UI library
            </label>
            <div className="select u-width-full-line">
              <select
                id="ui"
                value={uiLibrary}
                onChange={(e) => setUiLibrary(e.target.value)}
              >
                <option value="">Optional</option>
                {Object.keys(Config.uiLibraries).map((id) => (
                  <option key={id} value={id}>
                    {(Config.uiLibraries as Record<string, { name: string }>)[id].name}
                  </option>
                ))}
              </select>
              <span className="icon-cheveron-down" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* Section: Services */}
      <section className="card submit-section">
        <div className="u-flex-vertical u-gap-8 u-margin-block-end-16">
          <h3 className="heading-level-5">Appwrite services used</h3>
          <p className="u-x-small">Pick every service this project relies on.</p>
        </div>

        <div className="submit-services">
          {SERVICE_KEYS.map((s) => {
            const active = services[s];
            return (
              <button
                key={s}
                type="button"
                onClick={onService(s)}
                aria-pressed={active}
                className={`submit-service-pill${active ? " is-active" : ""}`}
              >
                <span className={`icon-${SERVICE_ICONS[s]}`} aria-hidden="true" />
                <span className="text">{SERVICE_LABELS[s]}</span>
                <span
                  className={`submit-service-check icon-${active ? "check" : "plus"}`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Section: Links */}
      <section className="card submit-section">
        <div className="u-flex-vertical u-gap-8 u-margin-block-end-16">
          <h3 className="heading-level-5">Links</h3>
          <p className="u-x-small">All optional. Skip the ones that don&apos;t apply.</p>
        </div>

        <div className="submit-grid">
          {URL_FIELDS.map(({ key, label, icon, placeholder }) => (
            <div className="form-item" key={key}>
              <label className="label" htmlFor={`url-${key}`}>
                {icon === "x-brand" ? (
                  <XIcon />
                ) : (
                  <span className={`icon-${icon}`} aria-hidden="true" />
                )}{" "}
                {label}
              </label>
              <input
                id={`url-${key}`}
                className="input-text"
                type="url"
                value={urls[key]}
                onChange={onUrl(key)}
                placeholder={placeholder}
                inputMode="url"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Status + actions */}
      {error && (
        <div className="alert is-danger" role="alert">
          <div className="alert-grid">
            <span className="icon-exclamation" aria-hidden="true" />
            <div className="alert-content">
              <p className="alert-message">{error}</p>
            </div>
          </div>
        </div>
      )}
      {success && (
        <div className="alert is-success" role="status">
          <div className="alert-grid">
            <span className="icon-check" aria-hidden="true" />
            <div className="alert-content">
              <p className="alert-message">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="submit-footer">
        <p className="u-x-small">
          By submitting you agree your project will be reviewed publicly.
        </p>
        <button type="submit" className="button is-primary" disabled={isLoading}>
          {isLoading ? (
            <span className="text">Submitting…</span>
          ) : (
            <>
              <span className="icon-cloud-upload" aria-hidden="true" />
              <span className="text">Submit project</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
