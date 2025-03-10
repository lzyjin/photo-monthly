"use client";

import CalendarDay from "@/components/calendar-day";
import CalendarMonth from "@/components/calendar-month";
import {Swiper, SwiperSlide} from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import 'swiper/css';
import 'swiper/css/virtual';
import {Virtual} from "swiper/modules";
import {useEffect, useState} from "react";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/24/solid";
import {CalendarsProps, PostsProps} from "@/app/(tab)/calendar/page";
import {notFound} from "next/navigation";
import {getPosts} from "@/app/(tab)/calendar/actions";
import {getMonthEndDate, getMonthStartDate} from "@/lib/utils";

interface CalendarProps {
  calendars: CalendarsProps;
  posts: PostsProps;
}

function generateDates(startDate: Date, endDate: Date) {
  const diff = Number(endDate) - Number(startDate);
  const oneDayMS = 1000 * 60 * 60 * 24; // 하루
  const days = diff / oneDayMS; // 해당 달이 며칠인지
  const firstDay = startDate.getDay(); // 첫번째 날의 요일 (0부터 6까지, 0이 일요일)
  let emptyCount = 0;
  const dates = [];

  if (firstDay === 0) {
    emptyCount = 6;
  } else {
    emptyCount = firstDay - 1;
  }

  for (let i = 0; i < emptyCount; i++) {
    dates.push(0);
  }

  for (let i = 1; i <= days; i++) {
    dates.push(i);
  }

  for (let i = 0; i < 7; i++) {
    if (dates.length % 7 !== 0) {
      dates.push(0);
    }
  }

  return dates;
}

export default function Calendar({calendars, posts}: CalendarProps) {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const [isThisMonth, setIsThisMonth] = useState(true);

  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);
  const [dates, setDates] = useState<number[]>([]);
  const [postList, setPostList] = useState(posts);

  const slides = Array.from({ length: 100 }).map((el, index) => `Slide ${index + 1}`);

  useEffect(() => {
    if (year === todayYear && month === todayMonth) {
      setIsThisMonth(true);
    } else {
      setIsThisMonth(false);
    }

    // dates 생성, posts 불러오기
    (async () => {
      const targetDate = new Date(year, month, 1, 0, 0, 0);
      const startDate = getMonthStartDate(targetDate);
      const endDate = getMonthEndDate(targetDate);

      const datesValue = generateDates(startDate, endDate);
      setDates(datesValue);

      const posts = await getPosts(startDate, endDate);
      setPostList(posts);
    })();

  }, [year, month, todayYear, todayMonth]);

  if (!calendars) {
    notFound();
  }

  const toPrevCal = () => {
    if (month !== 0) {
      setMonth(month => month - 1);
    } else {
      // 지금 1월일 때
      setMonth(11);
      setYear(year => year - 1);
    }
  };

  const toNextCal = () => {
    if (month !== 11) {
      setMonth(month => month + 1);
    } else {
      // 지금 12월일 때
      setMonth(0);
      setYear(year => year + 1);
    }
  };

  const toTodayCal = () => {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    setYear(todayYear);
    setMonth(todayMonth);
  };

  const changeMonth = (swiper: SwiperType) => {
    if (!swiper.swipeDirection) {
      return;
    }

    if (swiper.swipeDirection === "prev") {
      toPrevCal();
    } else {
      toNextCal();
    }
  };

  return (
    <>
      <div className="absolute left-0 top-0 bg-white w-full h-10 px-5 border-b border-foreground flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={toPrevCal}>
            <ChevronLeftIcon className="size-4"/>
          </button>
          <h1 className="font-semibold">{`${year}년 ${month + 1}월`}</h1>
          <button onClick={toNextCal}>
            <ChevronRightIcon className="size-4"/>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {
            isThisMonth ?
            null :
            <button
              className="font-semibold text-sm transition-colors py-1 px-1.5 rounded-full
              hover:bg-foreground hover:text-white"
              onClick={toTodayCal}>오늘
            </button>
          }
        </div>
      </div>

      <div className="w-full h-full">
        <div
          className="absolute left-0 top-10 bg-white w-full h-10 grid grid-cols-7 text-center border-b border-foreground
          *:flex *:justify-center *:items-center text-sm">
          {
            ["월", "화", "수", "목", "금", "토", "일",].map((v, i) => (
              <CalendarDay day={v} key={i}/>
            ))
          }
        </div>
        <div className="pt-20 pb-16 w-full h-full">
          <Swiper
            virtual
            modules={[Virtual]}
            spaceBetween={0}
            slidesPerView={1}
            initialSlide={Math.floor(slides.length / 2)}
            onTouchEnd={(swiper) => changeMonth(swiper)}
          >
            {
              slides.map((slideContent, index) => (
                <SwiperSlide key={slideContent} virtualIndex={index}>
                  <CalendarMonth
                    dates={dates}
                    year={year}
                    month={month}
                    posts={postList}
                    isThisMonth={isThisMonth}
                  />
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
      </div>
    </>
  );
}