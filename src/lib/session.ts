import {getIronSession} from "iron-session";
import {cookies} from "next/headers";

interface SessionContent {
  id?: number;
}

export async function getLoginSession() {
  return await getIronSession<SessionContent>(await cookies(), {
    cookieName: "pm-cookie",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function sessionLogin(id: number) {
  const session = await getLoginSession();
  session.id = id;
  await session.save();
}

export async function getLoggedInUserId() {
  const session = await getLoginSession();
  return session.id;
}

export async function sessionLogout() {
  const session = await getLoginSession();
  session.destroy();
}

export async function getCalendarSession() {
  return await getIronSession<SessionContent>(await cookies(), {
    cookieName: "pm-default-calendar",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function sessionSetDefaultCalendar(defaultCalendarId: number) {
  const session = await getCalendarSession();
  session.id = defaultCalendarId;
  await session.save();
}

export async function getDefaultCalendarId() {
  const session = await getCalendarSession();
  return session.id;
}