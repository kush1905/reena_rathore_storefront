export function sizedImage(url: string, width: number) {
  if (!url) return url;
  if (url.includes("images.unsplash.com")) {
    if (url.includes("w=")) return url.replace(/w=\d+/, `w=${width}`);
    return `${url}${url.includes("?") ? "&" : "?"}w=${width}&q=80`;
  }
  if (url.includes("images.pexels.com")) {
    if (url.includes("w=")) return url.replace(/([?&]w=)\d+/, `$1${width}`);
    return `${url}${url.includes("?") ? "&" : "?"}w=${width}`;
  }
  return url;
}

export const BLUR =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 20'%3E%3Crect fill='%23efe8dc' width='16' height='20'/%3E%3C/svg%3E";
