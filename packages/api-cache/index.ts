const cache: Record<string, any> = {};

export async function cachedFetch(url: string) {
  if (cache[url]) return cache[url];
  const res = await fetch(url);
  const data = await res.json();
  cache[url] = data;
  return data;
}
