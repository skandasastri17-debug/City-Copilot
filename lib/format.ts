export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatDuration(start: string, end: string) {
  const hours = (Date.parse(end) - Date.parse(start)) / 36e5;
  return `${hours.toFixed(hours % 1 === 0 ? 0 : 1)} hours`;
}
