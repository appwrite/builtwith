import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "./types";

export const thumbnailUrl = (fileId: string, width = 1280) => {
  const params = new URLSearchParams({
    project: APPWRITE_PROJECT_ID,
    width: String(width),
    output: "webp",
  });
  return `${APPWRITE_ENDPOINT}/storage/buckets/thumbnails/files/${fileId}/preview?${params.toString()}`;
};
