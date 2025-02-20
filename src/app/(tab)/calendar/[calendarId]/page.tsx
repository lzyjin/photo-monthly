import TabBar from "@/components/tab-bar";
import Calendar from "@/components/calendar";
import {getCalendars, getPosts} from "@/app/(tab)/calendar/[calendarId]/actions";
import {Prisma} from "@prisma/client";
import {notFound} from "next/navigation";

export type CalendarsProps = Prisma.PromiseReturnType<typeof getCalendars>;
export type PostsProps = Prisma.PromiseReturnType<typeof getPosts>;

export default async function CalendarPage({params}: {params: Promise<{calendarId: string}>}) {
  const calendarId = Number((await params).calendarId);

  if (!calendarId) {
    return notFound();
  }

  const calendars = await getCalendars();

  if (!calendars) {
    return notFound();
  }

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();

  const posts = await getPosts(calendarId, todayYear, todayMonth);

  return (
    <div className="w-full h-full">
      <Calendar calendars={calendars} posts={posts} calendarId={calendarId} />
      <TabBar />
    </div>
  );
}