import CalendarDate from "@/components/calendar-date";
import {PostsProps} from "@/app/(tab)/calendar/page";

interface CalendarMonthProps {
  dates: number[];
  year: number;
  month: number;
  posts: PostsProps;
  isThisMonth: boolean;
}

export default function CalendarMonth({dates, year, month, posts, isThisMonth}: CalendarMonthProps) {
  return (
    <div className="grid grid-cols-7 text-center">
      {
        dates.map((date, index) => (
          <CalendarDate
            key={`${date}-${index}}`}
            date={date}
            isThisMonth={isThisMonth}
            post={posts.find(p => p.date.getDate() === date)}
            month={month}
            year={year}
          />
        ))
      }
    </div>
  );
}