export function stringify(obj: Record<string, any>) {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
}

export function parse(qs: string) {
  return Object.fromEntries(new URLSearchParams(qs));
}
