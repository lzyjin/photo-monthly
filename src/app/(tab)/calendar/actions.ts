"use server";

import {db} from "@/lib/db";
import {getDefaultCalendarId, getLoggedInUserId} from "@/lib/session";

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

export async function getPosts(searchStartDate: Date, searchEndDate: Date) {
  const calendarId = await getDefaultCalendarId();

  const posts = await db.post.findMany({
    where: {
      calendarId,
      date: {
        gte: searchStartDate,
        lt: searchEndDate,
      },
    },
  });

  return posts;
}