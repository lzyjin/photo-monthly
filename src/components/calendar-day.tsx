interface CalendarDayProps {
  day: string;
}

export default function CalendarDay({day}: CalendarDayProps) {
  return (
    <div>
      <span>{day}</span>
    </div>
  );
}