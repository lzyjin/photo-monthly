import {getIronSession} from "iron-session";
import {cookies} from "next/headers";

interface SessionContent {
  id?: number;
}

export async function getSession() {
  return await getIronSession<SessionContent>(await cookies(), {
    cookieName: "pmcookie",
    password: process.env.COOKIE_PASSWORD!,
  });
}

export async function sessionLogin(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}

export async function getLoggedInUserId() {
  const session = await getSession();
  return session.id;
}

export async function sessionLogout() {
  const session = await getSession();
  session.destroy();
}

// export async function sessionSetDefaultCalendar(id: number) {
//   const session = await getSession();
//   session.defaultCalendarId = id;
//   await session.save();
// }