export function get(obj: any, path: string, defaultValue?: any) {
  return path.split('.').reduce((o, k) => (o || {})[k], obj) ?? defaultValue;
}
