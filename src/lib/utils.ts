export function formatDate(date: Date) {
  const dateTimeFormat = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return dateTimeFormat.format(date);
}

export function getMonthStartDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  return new Date(year, month, 1);
}

export function getMonthEndDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (month === 11) {
    // 12월이면
    return new Date(year + 1, 1, 1);
  } else {
    return new Date(year, month + 1, 1);
  }
}