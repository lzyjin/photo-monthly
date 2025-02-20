export function formatDate(date: Date) {
  const dateTimeFormat = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return dateTimeFormat.format(date);
}