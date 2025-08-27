export function format(date: Date, locale = 'en-US') {
  return date.toLocaleString(locale);
}
