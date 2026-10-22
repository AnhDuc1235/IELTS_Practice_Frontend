import { SERVER_API } from "@/utils/env";

export async function apiFetch<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${SERVER_API}${input}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: init?.cache,
  });

  if (!res.ok) {
    let detail: unknown = undefined;
    try {
      detail = await res.json();
    } catch {
    }
    const msg =
      typeof detail === "object" &&
      detail &&
      "message" in detail &&
      typeof (detail as { message: unknown }).message === "string"
        ? (detail as { message: string }).message
        : undefined;
    throw new Error(msg ?? `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}
