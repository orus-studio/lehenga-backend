const ADMIN_API_BASE_URL =
  (process.env.ADMIN_API_BASE_URL ?? "http://localhost:4000/api").replace(/\/$/, "");

export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

export async function adminApiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const init: RequestInit = {
    method: options.method ?? "GET",
    headers,
  };

  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${ADMIN_API_BASE_URL}${path}`, {
    ...init,
  });

  const rawText = await response.text();
  const json = rawText ? (JSON.parse(rawText) as { success?: boolean; message?: string; data?: T }) : null;

  if (!response.ok) {
    throw new AdminApiError(json?.message ?? "Admin API request failed", response.status);
  }

  return (json?.data ?? json) as T;
}
