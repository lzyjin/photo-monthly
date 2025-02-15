import CalendarDate from "@/components/calendar-date";
import {useEffect, useState} from "react";
import {PostsProps} from "@/app/(tab)/calendar/page";

interface CalendarMonthProps {
  dates: number[];
  year: number;
  month: number;
  posts: PostsProps;
}

export default function CalendarMonth({dates, year, month, posts}: CalendarMonthProps) {
  const [isThisMonth, setIsThisMonth] = useState(false);
  const showingDate = new Date(year, month, 1);
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();

  useEffect(() => {
    if (showingDate.getFullYear() === todayYear && showingDate.getMonth() === todayMonth) {
      setIsThisMonth(true);
    } else {
      setIsThisMonth(false);
    }
  }, [showingDate, todayYear, todayMonth]);

  return (
    <div className="grid grid-cols-7 text-center">
      {
        dates.map((date, index) => (
          <CalendarDate
            key={`${date}-${index}}`}
            date={date}
            isThisMonth={isThisMonth}
            post={posts.find(p => p.date.getDate() === date)}
          />
        ))
      }
    </div>
  );
}