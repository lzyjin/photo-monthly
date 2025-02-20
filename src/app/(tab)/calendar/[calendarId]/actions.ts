"use server";

import {db} from "@/lib/db";
import {getLoggedInUserId} from "@/lib/session";

export async function getCalendars() {
  const loggedInUserId = await getLoggedInUserId();

  if (!loggedInUserId) {
    return;
  }

  const calendars = await db.calendar.findMany({
    where: {
      userId: loggedInUserId,
    },
    select: {
      id: true,
      name: true,
      isDefault: true,
    }
  });

  return calendars;
}

export async function getPosts(calendarId: number, year: number, month: number) {
  const posts = await db.post.findMany({
    where: {
      calendarId: calendarId,
      date: {
        gte: new Date(year, month, 1),
        lt: new Date(year, month + 1, 1),
      },
    },
  });

  return posts;
}