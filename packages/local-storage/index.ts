export function setItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getItem(key: string) {
  const v = localStorage.getItem(key);
  return v ? JSON.parse(v) : null;
}
