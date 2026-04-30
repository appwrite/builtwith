"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { ClientAppwrite } from "~/lib/appwrite-client";
import { Config } from "~/lib/config";
import { useApp } from "~/components/providers";

const SERVICE_KEYS = [
  "databases",
  "functions",
  "storage",
  "realtime",
  "authentication",
  "messaging",
] as const;
type ServiceKey = (typeof SERVICE_KEYS)[number];

export default function SubmitForm() {
  const { account } = useApp();

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [framework, setFramework] = useState("");
  const [uiLibrary, setUiLibrary] = useState("");
  const [useCase, setUseCase] = useState("");
  const [urls, setUrls] = useState({
    googlePlay: "",
    appStore: "",
    linux: "",
    macOs: "",
    windows: "",
    website: "",
    twitter: "",
    github: "",
    article: "",
  });
  const [services, setServices] = useState<Record<ServiceKey, boolean>>({
    databases: false,
    functions: false,
    storage: false,
    realtime: false,
    authentication: false,
    messaging: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const onUrl = (key: keyof typeof urls) => (e: ChangeEvent<HTMLInputElement>) =>
    setUrls((u) => ({ ...u, [key]: e.target.value }));

  const onService = (k: ServiceKey) => (e: ChangeEvent<HTMLInputElement>) =>
    setServices((s) => ({ ...s, [k]: e.target.checked }));

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
        !name ||
        !tagline ||
        !description ||
        !platform
      ) {
        throw new Error("Please fill in all the details. Only URLs are optional.");
      }

      const usedServices = SERVICE_KEYS.filter((s) => services[s]);
      if (usedServices.length === 0) {
        throw new Error("Your project must use at least one Appwrite service.");
      }

      const { $id: fileId } = await ClientAppwrite.uploadThumbnail(file);

      const data = {
        platform,
        name,
        tagline,
        description,
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

      const response = await ClientAppwrite.submitProject(data);
      setSuccess(response.msg ?? "Submitted! We'll review shortly.");
      setName("");
      setTagline("");
      setDescription("");
      setFramework("");
      setUiLibrary("");
      setUseCase("");
      setUrls({
        googlePlay: "",
        appStore: "",
        linux: "",
        macOs: "",
        windows: "",
        website: "",
        twitter: "",
        github: "",
        article: "",
      });
      setServices({
        databases: false,
        functions: false,
        storage: false,
        realtime: false,
        authentication: false,
        messaging: false,
      });
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="alert is-info">
        <div className="alert-grid">
          <span className="icon-info" aria-hidden="true" />
          <div className="alert-content">
            <h6 className="alert-title">Project submissions need reviews.</h6>
            <p className="alert-message">
              We review projects manually to keep the list professional.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={onSubmit} className="u-flex-vertical u-gap-24 u-margin-block-start-24">
        <ul className="form-list">
          <li className="form-item">
            <label className="label is-required" htmlFor="name">
              Project Name
            </label>
            <input
              id="name"
              className="input-text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </li>
          <li className="form-item">
            <label className="label is-required" htmlFor="tagline">
              Tagline
            </label>
            <input
              id="tagline"
              className="input-text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              required
            />
          </li>
          <li className="form-item">
            <label className="label is-required" htmlFor="description">
              Description (Markdown)
            </label>
            <textarea
              id="description"
              className="input-text"
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </li>
          <li className="form-item">
            <label className="label is-required" htmlFor="thumb">
              Thumbnail Image
            </label>
            <input id="thumb" type="file" accept="image/*" onChange={onFile} required />
          </li>
          <li className="form-item">
            <label className="label is-required" htmlFor="platform">
              Platform
            </label>
            <div className="select u-width-full-line">
              <select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="">Select option</option>
                {Object.keys(Config.platforms).map((id) => (
                  <option key={id} value={id}>
                    {(Config.platforms as Record<string, { name: string }>)[id].name}
                  </option>
                ))}
              </select>
              <span className="icon-cheveron-down" aria-hidden="true" />
            </div>
          </li>
          <li className="form-item">
            <label className="label is-required" htmlFor="usecase">
              Use Case
            </label>
            <div className="select u-width-full-line">
              <select id="usecase" value={useCase} onChange={(e) => setUseCase(e.target.value)}>
                <option value="">Select option</option>
                {Object.keys(Config.useCases).map((id) => (
                  <option key={id} value={id}>
                    {(Config.useCases as Record<string, { name: string }>)[id].name}
                  </option>
                ))}
              </select>
              <span className="icon-cheveron-down" aria-hidden="true" />
            </div>
          </li>
          <li className="form-item">
            <label className="label" htmlFor="framework">
              Framework
            </label>
            <div className="select u-width-full-line">
              <select id="framework" value={framework} onChange={(e) => setFramework(e.target.value)}>
                <option value="">Select option</option>
                {Object.keys(Config.frameworks).map((id) => (
                  <option key={id} value={id}>
                    {(Config.frameworks as Record<string, { name: string }>)[id].name}
                  </option>
                ))}
              </select>
              <span className="icon-cheveron-down" aria-hidden="true" />
            </div>
          </li>
          <li className="form-item">
            <label className="label" htmlFor="ui">
              UI Library
            </label>
            <div className="select u-width-full-line">
              <select id="ui" value={uiLibrary} onChange={(e) => setUiLibrary(e.target.value)}>
                <option value="">Select option</option>
                {Object.keys(Config.uiLibraries).map((id) => (
                  <option key={id} value={id}>
                    {(Config.uiLibraries as Record<string, { name: string }>)[id].name}
                  </option>
                ))}
              </select>
              <span className="icon-cheveron-down" aria-hidden="true" />
            </div>
          </li>
          <li className="form-item">
            <span className="label is-required">Appwrite Services Used</span>
            <ul className="u-flex u-flex-wrap u-gap-16 u-margin-block-start-8">
              {SERVICE_KEYS.map((s) => (
                <li key={s}>
                  <label className="u-flex u-cross-center u-gap-8">
                    <input
                      type="checkbox"
                      checked={services[s]}
                      onChange={onService(s)}
                    />
                    <span style={{ textTransform: "capitalize" }}>{s}</span>
                  </label>
                </li>
              ))}
            </ul>
          </li>
          {(["website", "github", "twitter", "article", "googlePlay", "appStore", "linux", "macOs", "windows"] as const).map(
            (k) => (
              <li className="form-item" key={k}>
                <label className="label" htmlFor={`url-${k}`} style={{ textTransform: "capitalize" }}>
                  {k} URL
                </label>
                <input
                  id={`url-${k}`}
                  className="input-text"
                  value={urls[k]}
                  onChange={onUrl(k)}
                  placeholder="https://"
                />
              </li>
            )
          )}
        </ul>

        {error && (
          <div className="alert is-danger">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="alert is-success">
            <p>{success}</p>
          </div>
        )}

        <button type="submit" className="button is-primary" disabled={isLoading}>
          <span className="text">{isLoading ? "Submitting..." : "Submit"}</span>
        </button>
      </form>
    </>
  );
}
