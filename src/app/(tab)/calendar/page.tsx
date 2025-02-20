import TabBar from "@/components/tab-bar";
import Calendar from "@/components/calendar";
import {getCalendars, getPosts} from "@/app/(tab)/calendar/actions";
import {Prisma} from "@prisma/client";
import {notFound} from "next/navigation";
import {getDefaultCalendarId} from "@/lib/session";
import {getMonthEndDate, getMonthStartDate} from "@/lib/utils";

export type CalendarsProps = Prisma.PromiseReturnType<typeof getCalendars>;
export type PostsProps = Prisma.PromiseReturnType<typeof getPosts>;

export default async function CalendarPage() {
  const calendarId = await getDefaultCalendarId();

  if (!calendarId) {
    return notFound();
  }

  const calendars = await getCalendars();

  if (!calendars) {
    return notFound();
  }

  const today = new Date();
  const startDate = getMonthStartDate(today);
  const endDate = getMonthEndDate(today);
  const posts = await getPosts(startDate, endDate);

  return (
    <div className="w-full h-full">
      <Calendar calendars={calendars} posts={posts} calendarId={calendarId} />
      <TabBar />
    </div>
  );
}