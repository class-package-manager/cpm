export function truncate(str: string, length: number, ending = '...') {
  return str.length > length ? str.slice(0, length) + ending : str;
}
