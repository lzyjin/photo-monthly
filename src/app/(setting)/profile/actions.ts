"use server";

import {sessionLogout} from "@/lib/session";
import {redirect} from "next/navigation";

export async function logout() {
  await sessionLogout();
  redirect("/");
}