export function formatDate(date: Date) {
  const dateTimeFormat = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return dateTimeFormat.format(date);
}

// 기준달 1일 구하기
export function getMonthStartDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  return new Date(year, month, 1, 0, 0, 0);
}

// 기준달의 다음달 1일 구하기
export function getMonthEndDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  if (month === 11) {
    // 12월이면
    return new Date(year + 1, 0, 1, 0, 0, 0);
  } else {
    return new Date(year, month + 1, 1, 0, 0, 0);
  }
}