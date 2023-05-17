import type { RequestHandler } from "@builder.io/qwik-city";
import * as setCookie from "set-cookie-parser";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT } from "~/AppwriteService";

function isRelativeUrl(url: string): boolean {
  try {
    new URL(url);
    return false;
  } catch (error) {
    return true;
  }
}

export const onPost: RequestHandler = async (requestEvent) => {
  try {
    const uri = new URL(`${APPWRITE_ENDPOINT}/account/sessions/oauth2/github`);
    uri.searchParams.set("project", APPWRITE_PROJECT);

    const response = await fetch(uri.toString());

    console.log(response.status + response.statusText);
    const setCookieStr = response.headers.get("set-cookie") ?? "";
    const cookies = setCookie.parse(setCookieStr);

    for (const cookie of cookies) {
      requestEvent.cookie.set(cookie.name, cookie.value, {
        secure: cookie.secure,
        sameSite: cookie.sameSite as any,
        path: cookie.path,
        maxAge: cookie.maxAge,
        httpOnly: cookie.httpOnly,
        expires: cookie.expires,
      });
    }

    requestEvent.json(200, { success: true });
  } catch (err: any) {
    requestEvent.json(400, { messages: [err.message] });
  }
};
