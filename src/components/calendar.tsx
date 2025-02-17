"use client";

import CalendarDay from "@/components/calendar-day";
import CalendarMonth from "@/components/calendar-month";
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/virtual';
import {Virtual} from "swiper/modules";
import {useEffect, useState} from "react";
import {CalendarIcon, ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/24/solid";
import {CalendarsProps, PostsProps} from "@/app/(tab)/calendar/page";
import {notFound} from "next/navigation";

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
  const [activeCalendarId, setActiveCalendarId] = useState<number>();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [dates, setDates] = useState<number[]>([]);
  const slides = Array.from({ length: 100 }).map((el, index) => `Slide ${index + 1}`);

  if (!calendars) {
    notFound();
  }

  useEffect(() => {
    calendars.map((calendar, i) => {
      if (calendar.isDefault) {
        setActiveCalendarId(calendar.id);
      }
    })
  }, [calendars]);

  useEffect(() => {
    const datesValue = generateDates(new Date(year, month, 1), new Date(year, month + 1, 1));
    setDates(datesValue);
  }, [year, month]);

  const toPrevCal = () => {
    if (month !== 0) {
      setMonth(month - 1);
    } else {
      setMonth(11);
      setYear(year - 1);
    }

    const datesValue = generateDates(new Date(year, month, 1), new Date(year, month + 1, 1));
    setDates(datesValue);
  };

  const toNextCal = () => {
    if (month !== 11) {
      setMonth(month + 1);
    } else {
      setMonth(0);
      setYear(year + 1);
    }

    const datesValue = generateDates(new Date(year, month, 1), new Date(year, month + 1, 1));
    setDates(datesValue);
  };

  const toTodayCal = () => {
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const datesValue = generateDates(new Date(todayYear, todayMonth, 1), new Date(todayYear, todayMonth + 1, 1));
    setYear(todayYear);
    setMonth(todayMonth);
    setDates(datesValue);
  };

  const changeMonth = (swiper: any) => {
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
          {/*<div className="relative">*/}
          {/*  <button>*/}
          {/*    <CalendarIcon className="size-4"/>*/}
          {/*  </button>*/}
          {/*  <ul className="absolute right-0 top-[100%] z-10 w-20 bg-white border border-foreground">*/}
          {/*    {*/}
          {/*      calendars && calendars.map((calendar, i) => (*/}
          {/*        <li key={calendar.id}*/}
          {/*          className={activeCalendarId === calendar.id ? "bg-foreground text-white" : ""}>*/}
          {/*          {calendar.name}*/}
          {/*        </li>*/}
          {/*      ))*/}
          {/*    }*/}
          {/*  </ul>*/}
          {/*</div>*/}
          <button
            className="font-semibold text-sm transition-colors py-1 px-1.5 rounded-full hover:bg-foreground hover:text-white"
            onClick={toTodayCal}>오늘
          </button>
        </div>
      </div>

      <div className="w-full h-full">
        <div className="absolute left-0 top-10 bg-white w-full h-10 grid grid-cols-7 text-center border-b border-foreground *:flex *:justify-center *:items-center text-sm">
          {
            ["월", "화", "수", "목", "금", "토", "일",].map((v, i) => (
              <CalendarDay day={v} key={i}/>
            ))
          }
        </div>
        <div className="pt-20 w-full h-full">
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
                  <CalendarMonth dates={dates} year={year} month={month} posts={posts} />
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
      </div>
    </>
  );
}