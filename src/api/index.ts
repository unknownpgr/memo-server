export async function get<T>(url: string) {
  const res = await fetch(url);
  return (await res.json()) as T;
}

export async function post<T>(url: string, body: T) {
  const res = await fetch(url, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await res.json();
}

export async function put<T>(url: string, body: T) {
  const res = await fetch(url, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return await res.json();
}

export function del<T>(url: string) {
  return fetch(url, {
    method: "delete",
  });
}
