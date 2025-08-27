export function merge(target: any, source: any) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], merge(target[key], source[key]));
    }
  }
  return { ...target, ...source };
}
