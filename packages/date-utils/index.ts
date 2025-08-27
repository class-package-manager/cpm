export function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export function daysBetween(d1: Date, d2: Date) {
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}
