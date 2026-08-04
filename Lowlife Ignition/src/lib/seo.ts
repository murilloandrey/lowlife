export const SITE_URL = "https://lowlifeest15.net";

export function canonicalUrl(pathname: string) {
  return new URL(pathname, SITE_URL).href;
}
