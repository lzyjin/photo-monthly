import Image from "next/image";
import {useEffect, useState} from "react";

interface CalendarDateProps {
  date: number;
  year: number;
  month: number;
  isThisMonth: boolean;
  post?: {
    id: number;
    photo: string;
    date: Date;
    memo: string | null;
    createdAt: Date;
    updatedAt: Date;
    calendarId: number;
  }
}

export default function CalendarDate({date, year, month, isThisMonth, post}: CalendarDateProps) {
  const today = new Date();
  const [isPostDateShown, setIsPostDateShown] = useState(false);
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    if (post && (post.date.getFullYear() === year &&
      post.date.getMonth() === month &&
      post.date.getDate() === date)) {
      setIsPostDateShown(true);
    } else {
      setIsPostDateShown(false);
    }
  }, [year, month, date, post]);

  useEffect(() => {
    if (isThisMonth && date === today.getDate()) {
      setIsToday(true);
    } else {
      setIsToday(false);
    }
  }, [year, month, date, isThisMonth]);

  return (
    <div className="h-28 border-b border-foreground">
      {
        date !== 0 ?
        <div className="relative w-full h-full overflow-hidden">
          {
            isPostDateShown && (
             <Image src={`${post?.photo}/smaller`} alt={post?.date.toLocaleDateString() + "의 사진"} fill className="object-cover" />
            )
          }
          {
            isToday ?
            <div className="relative w-full">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bottom-0 size-5 rounded-full bg-foreground" />
              <span className="text-white relative">{date}</span>
            </div> :
            <span className="relative">{date}</span>
          }
        </div> :
        <div></div>
      }
    </div>
  );
}