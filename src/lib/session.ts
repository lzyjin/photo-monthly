import {getIronSession} from "iron-session";
import {cookies} from "next/headers";

interface SessionContent {
  id?: number;
}

export async function getSession() {
  const session = await getIronSession<SessionContent>(await cookies(), {
    cookieName: "pmcookie",
    password: process.env.COOKIE_PASSWORD!,
  });

  return session;
}

export async function sessionLogin(id: number) {
  const session = await getSession();
  session.id = id;
  await session.save();
}