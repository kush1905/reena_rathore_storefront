import { apiUrl } from "./api-config";

export { getApiBaseUrl, apiUrl } from "./api-config";

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = apiUrl(path);
  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Failed to fetch";
    throw new ApiError(0, "NETWORK_ERROR", `${reason} (${url})`);
  }
  const json = (await response.json().catch(() => null)) as
    | { success: true; data: T }
    | { success: false; error: { code: string; message: string } }
    | null;
  if (!json || json.success === false) {
    throw new ApiError(
      response.status,
      json?.error.code ?? "API_ERROR",
      `${json?.error.message ?? "Request failed"} (${url})`,
    );
  }
  return json.data;
}
