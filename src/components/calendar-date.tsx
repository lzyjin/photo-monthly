import Image from "next/image";
import {useEffect, useState} from "react";
import {redirect} from "next/navigation";

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
  const [isFuture, setIsFuture] = useState(false);

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

    const showDay = new Date(year, month, date);
    if (Number(today) - Number(showDay) < 0) {
      setIsFuture(true);
    } else {
      setIsFuture(false);
    }

  }, [year, month, date, isThisMonth, today]);

  const onDateClick = () => {
    console.log("달력 날짜 클릭!", year, month, date);
    console.log("post: ", post)

    if (post) {
      // post가 있으면 상세페이지로 이동 "/calendar/1"
      redirect(`/calendar/${post.id}`);
    } else {
      // post가 없으면 등록페이지로 이동 "/calendar/add"
      // 클릭한 날짜(년, 월, 일), 캘린더아이디 필요
      redirect(`/calendar/add?year=${year}&month=${month}&date=${date}`);
    }
  };

  return (
    <div className="h-28 border-b border-foreground">
      {
        date !== 0 ?
          (
            isFuture ?
            <div>
              <span className="opacity-40">{date}</span>
            </div> :
            <div className="relative w-full h-full overflow-hidden cursor-pointer" onClick={onDateClick}>
              {
                isPostDateShown && (
                  <Image
                    src={`${post?.photo}/smaller`}
                    alt={post?.date.toLocaleDateString() + "의 사진"}
                    fill
                    className="object-cover"
                  />
                )
              }
              {
                isToday ?
                  <div className="relative w-full">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bottom-0 size-5 rounded-full bg-foreground"/>
                    <span className="text-white relative">{date}</span>
                  </div> :
                  <span className="relative">{date}</span>
              }
            </div>
          ) :
          <div className="cursor-none pointer-events-none"></div>
      }
    </div>
  );
}