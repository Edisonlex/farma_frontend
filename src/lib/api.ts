const baseUrl =
  typeof window !== "undefined" ? process.env.NEXT_PUBLIC_API_URL || "" : "";

export function hasApi() {
  return !!baseUrl;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res.text();
}

export async function apiGet(path: string) {
  if (!hasApi()) throw new Error("API no configurada");
  const res = await fetch(`${baseUrl}${path}`, { credentials: "include" });
  return handleResponse(res);
}

export async function apiPost(path: string, body?: any) {
  if (!hasApi()) throw new Error("API no configurada");
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse(res);
}

export async function apiPut(path: string, body?: any) {
  if (!hasApi()) throw new Error("API no configurada");
  const res = await fetch(`${baseUrl}${path}`, {
    method: "PUT",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse(res);
}

export async function apiDelete(path: string) {
  if (!hasApi()) throw new Error("API no configurada");
  const res = await fetch(`${baseUrl}${path}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(res);
}

export async function apiDownload(path: string) {
  if (!hasApi()) throw new Error("API no configurada");
  const res = await fetch(`${baseUrl}${path}`, { credentials: "include" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  return blob;
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
