import {
  $,
  NoSerialize,
  component$,
  noSerialize,
  useSignal,
} from "@builder.io/qwik";
import { AppwriteService } from "~/AppwriteService";
import { Config } from "~/Config";
export default component$(() => {
  const file = useSignal<NoSerialize<File> | null>(null);

  const filePicked = $((event: any) => {
    const el: HTMLInputElement | null = event.target;
    const tempFile = el && el.files ? el.files[0] ?? null : null;

    if (tempFile === null) {
      file.value = tempFile;
      return;
    }

    file.value = noSerialize(tempFile);
  });

  const name = useSignal("");
  const tagline = useSignal("");
  const description = useSignal("");

  const framework = useSignal("");
  const uiLibrary = useSignal("");
  const useCase = useSignal("");

  const websiteUrl = useSignal("");
  const twitterUrl = useSignal("");
  const githubUrl = useSignal("");
  const articleUrl = useSignal("");

  const servicesDb = useSignal(false);
  const servicesFunctions = useSignal(false);
  const servicesAuth = useSignal(false);
  const servicesStorage = useSignal(false);
  const servicesRealtime = useSignal(false);

  const error = useSignal("");
  const success = useSignal("");
  const isLoading = useSignal(false);

  const submitProject = $(async () => {
    isLoading.value = true;

    try {
      if (
        !file.value ||
        !useCase.value ||
        !uiLibrary.value ||
        !framework.value ||
        !name.value ||
        !tagline.value ||
        !description.value
      ) {
        throw Error("Please fill in all the defail. Only URLs are optional.");
      }

      const services: string[] = [];

      if (servicesDb.value) {
        services.push("databases");
      }
      if (servicesFunctions.value) {
        services.push("functions");
      }
      if (servicesStorage.value) {
        services.push("stirage");
      }
      if (servicesRealtime.value) {
        services.push("realtime");
      }
      if (servicesAuth.value) {
        services.push("authentication");
      }

      if(services.length <= 0) {
        throw Error("Your project must use at least one Appwrite service.");
      }

      const { $id: fileId } = await AppwriteService.uploadThumbnail(file.value);

      const data = {
        name: name.value,
        tagline: tagline.value,
        description: description.value,
        framework: framework.value,
        uiLibrary: uiLibrary.value,
        useCase: useCase.value,
        urlWebsite: websiteUrl.value,
        urlTwitter: twitterUrl.value,
        urlGitHub: githubUrl.value,
        urlArticle: articleUrl.value,
        services,
        fileId
      };

      const response = await AppwriteService.submitProject(data);
      success.value = response.msg;
      error.value = "";

      name.value = "";
      tagline.value = "";
      description.value = "";
      framework.value = "";
      uiLibrary.value = "";
      useCase.value = "";
      websiteUrl.value = "";
      twitterUrl.value = "";
      githubUrl.value = "";
      articleUrl.value = "";
      servicesDb.value = false;
      servicesAuth.value = false;
      servicesRealtime.value = false;
      servicesStorage.value = false;
      servicesFunctions.value = false;
      file.value = null;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <>
      <section class="alert is-info">
        <div class="alert-grid">
          <span class="icon-info" aria-hidden="true"></span>
          <div class="alert-content">
            <h6 class="alert-title">Project submissions need reviews.</h6>
            <p class="alert-message">
              We review projects manually to keep the list professional. Please
              take your time when filling submission.
            </p>
          </div>
        </div>
      </section>

      <form
        onSubmit$={submitProject}
        preventdefault:submit
        role="form"
        class="form common-section"
        data-hs-cf-bound="true"
      >
        <article class="card common-section">
          <div class="common-section grid-1-2" style="margin-block-start: 0px;">
            <div class="grid-1-2-col-1 u-flex u-flex-vertical u-gap-16">
              <h6 class="heading-level-7">Submit Project</h6>
              <p class="text">
                It's your time to shine! Share with us what you built with
                Appwrite, and we will promote your project on the homepage of
                this app.
              </p>
            </div>
            <div class="grid-1-2-col-2 u-flex u-flex-vertical u-gap-24">
              <ul class="form-list">
                <h3 class="eyebrow-heading-2">1. Project Information</h3>
                <li class="form-item">
                  <label class="label" for="name">
                    Name
                  </label>
                  <div class="input-text-wrapper">
                    <input
                      bind:value={name}
                      id="name"
                      placeholder="Project Name"
                      type="text"
                      class="input-text"
                    />
                  </div>
                </li>
                <li class="form-item">
                  <label class="label" for="tagline">
                    Tagline
                  </label>
                  <div class="input-text-wrapper">
                    <input
                      bind:value={tagline}
                      id="tagline"
                      placeholder="Tagline or slogan"
                      type="text"
                      class="input-text"
                    />
                  </div>
                </li>
                <li class="form-item">
                  <label
                    class="label u-flex u-main-space-between u-cross-center"
                    for="description"
                  >
                    <p>Description</p>
                    <div class="tag">
                      <span class="icon-info" aria-hidden="true"></span>
                      <span class="text">Supports Markdown</span>
                    </div>
                  </label>
                  <textarea
                    bind:value={description}
                    class="input-text"
                    id="description"
                    placeholder="Detailed information about project"
                  ></textarea>
                </li>

                <li class="form-item">
                  <label class="label" for="previewimage">
                    Preview Image
                  </label>

                  <input
                    id="previewimage"
                    accept=".jpg,.png,.jpeg"
                    type="file"
                    style="display: none;"
                    onChange$={(event) => filePicked(event)}
                  />
                  <div class="upload-box box is-border-dashed is-no-shadow u-padding-24">
                    <div class="upload-file-box">
                      <div class="u-flex u-main-center u-cross-center u-gap-16 u-flex-vertical-mobile">
                        <p class="upload-file-box-info body-text-2 u-normal">
                          Max file size: 10MB
                        </p>
                        <button
                          preventdefault:click
                          onClick$={() => {
                            const el: HTMLInputElement | null =
                              document.querySelector("#previewimage");
                            if (el) {
                              el.click();
                            }
                          }}
                          class="button is-secondary is-full-width-mobile"
                        >
                          <span class="text">Choose a file</span>
                        </button>
                      </div>

                      {file.value && (
                        <ul class="upload-file-box-list u-min-width-0">
                          <li class="u-flex u-cross-center u-min-width-0">
                            <span
                              class="icon-document"
                              aria-hidden="true"
                            ></span>
                            <span class="upload-file-box-name u-min-width-0">
                              {file.value.name}
                            </span>
                            <span class="upload-file-box-size u-margin-inline-start-4 u-margin-inline-end-16">
                              {Math.ceil(file.value.size / 1024)}KB
                            </span>
                            <button
                              onClick$={() => {
                                file.value = null;
                              }}
                              type="button"
                              class="button is-text is-only-icon u-margin-inline-start-auto"
                              aria-label="remove file"
                              style="--button-size:1.5rem;"
                            >
                              <span class="icon-x" aria-hidden="true"></span>
                            </button>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </li>

                <h3 class="eyebrow-heading-2 u-margin-block-start-12">
                  2. Technology Information
                </h3>
                <li class="form-item">
                  <label class="label" for="framework">
                    Framework
                  </label>
                  <div class="select u-width-full-line">
                    <select bind:value={framework} name="pets" id="framework">
                      <option value="">Select option</option>
                      {Object.keys(Config.frameworks).map((framework) => (
                        <option value={framework}>
                          {(Config.frameworks as any)[framework].name}
                        </option>
                      ))}
                    </select>
                    <span class="icon-cheveron-down" aria-hidden="true"></span>
                  </div>
                </li>
                <li class="form-item">
                  <label class="label" for="uilibrary">
                    UI Library
                  </label>
                  <div class="select u-width-full-line">
                    <select bind:value={uiLibrary} name="pets" id="uilibrary">
                      <option value="">Select option</option>
                      {Object.keys(Config.uiLibraries).map((uiLibrary) => (
                        <option value={uiLibrary}>
                          {(Config.uiLibraries as any)[uiLibrary].name}
                        </option>
                      ))}
                    </select>
                    <span class="icon-cheveron-down" aria-hidden="true"></span>
                  </div>
                </li>
                <li class="form-item">
                  <label class="label" for="usecase">
                    Use Case
                  </label>
                  <div class="select u-width-full-line">
                    <select bind:value={useCase} name="pets" id="usecase">
                      <option value="">Select option</option>
                      {Object.keys(Config.useCases).map((useCase) => (
                        <option value={useCase}>
                          {(Config.useCases as any)[useCase].name}
                        </option>
                      ))}
                    </select>
                    <span class="icon-cheveron-down" aria-hidden="true"></span>
                  </div>
                </li>
                <li class="form-item">
                  <label class="label" for="usecase">
                    Appwrite Services
                  </label>
                  <div class="u-flex-vertical u-gap-2">
                    <div class="u-width-full-line u-flex u-gap-8 u-margin-block-start-4 u-cross-center">
                      <input type="checkbox" bind:checked={servicesDb} />{" "}
                      <span>Databases</span>
                    </div>
                    <div class="u-width-full-line u-flex u-gap-8 u-margin-block-start-4 u-cross-center">
                      <input type="checkbox" bind:checked={servicesAuth} />{" "}
                      <span>Authorization</span>
                    </div>
                    <div class="u-width-full-line u-flex u-gap-8 u-margin-block-start-4 u-cross-center">
                      <input type="checkbox" bind:checked={servicesStorage} />{" "}
                      <span>Storage</span>
                    </div>
                    <div class="u-width-full-line u-flex u-gap-8 u-margin-block-start-4 u-cross-center">
                      <input type="checkbox" bind:checked={servicesFunctions} />{" "}
                      <span>Functions</span>
                    </div>
                    <div class="u-width-full-line u-flex u-gap-8 u-margin-block-start-4 u-cross-center">
                      <input type="checkbox" bind:checked={servicesRealtime} />{" "}
                      <span>Realtime</span>
                    </div>
                  </div>
                </li>

                <h3 class="eyebrow-heading-2 u-margin-block-start-12">
                  3. Social Information (optional)
                </h3>
                <li class="form-item">
                  <label class="label" for="website">
                    Website URL
                  </label>
                  <div class="input-text-wrapper">
                    <input
                      bind:value={websiteUrl}
                      id="website"
                      placeholder="https://..."
                      type="text"
                      class="input-text"
                    />
                  </div>
                </li>
                <li class="form-item">
                  <label class="label" for="github">
                    GitHub URL
                  </label>
                  <div class="input-text-wrapper">
                    <input
                      bind:value={githubUrl}
                      id="github"
                      placeholder="https://github.com/..."
                      type="text"
                      class="input-text"
                    />
                  </div>
                </li>
                <li class="form-item">
                  <label class="label" for="twitter">
                    Twitter URL
                  </label>
                  <div class="input-text-wrapper">
                    <input
                      bind:value={twitterUrl}
                      id="twitter"
                      placeholder="https://twitter.com/..."
                      type="text"
                      class="input-text"
                    />
                  </div>
                </li>
                <li class="form-item">
                  <label class="label" for="article">
                    Article URL
                  </label>
                  <div class="input-text-wrapper">
                    <input
                      bind:value={articleUrl}
                      id="article"
                      placeholder="https://dev.to/..."
                      type="text"
                      class="input-text"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="common-section card-separator u-flex u-main-end">
            <button
              class={`button ${isLoading.value ? "is-secondary" : ""}`}
              type="submit"
            >
              {isLoading.value ? <div class="loader"></div> : <>Submit</>}
            </button>
          </div>

          {error.value && (
            <div
              style="text-align: right;"
              class="u-margin-block-start-12 u-color-text-danger"
            >
              {error.value}
            </div>
          )}

          {success.value && (
            <div
              style="text-align: right;"
              class="u-margin-block-start-12 u-color-text-success"
            >
              {success.value}
            </div>
          )}
        </article>
      </form>
    </>
  );
});
