export function setSession(key: string, value: any) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSession(key: string) {
  const v = sessionStorage.getItem(key);
  return v ? JSON.parse(v) : null;
}
