// Address of the DaviGoo website + API (the Cloudflare Worker). Change it here, or set
// EXPO_PUBLIC_API_URL, once the site has its own domain (now https://davigoo.com).
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "https://davigoo.com").replace(/\/$/, "");
