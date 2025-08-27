export function isNumber(value: any) {
  return typeof value === 'number' && !isNaN(value);
}

export function isString(value: any) {
  return typeof value === 'string';
}
