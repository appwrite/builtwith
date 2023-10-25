import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ send, headers, url }) => {
  const imageUrl = url.searchParams.get("url");

  if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
    send(400, "Invalid or missing URL parameter");
    return;
  }

  try {
    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error("Invalid content type");
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    headers.set("Content-Type", contentType);
    send(200, buffer);
  } catch (error) {
    send(400, "Error fetching image");
  }
};
