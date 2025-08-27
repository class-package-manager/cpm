export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelCase(str: string) {
  return str.replace(/-./g, m => m[1].toUpperCase());
}
