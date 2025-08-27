export async function get(url: string) {
  const res = await fetch(url);
  return res.json();
}

export async function post(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}
