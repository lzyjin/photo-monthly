"use server";

import {getLoggedInUserId, sessionLogout} from "@/lib/session";
import {redirect} from "next/navigation";
import {db} from "@/lib/db";

export async function logout() {
  await sessionLogout();
  redirect("/");
}

export async function deleteAccount() {
  const loggedInUserId = await getLoggedInUserId();
  const user = await db.user.update({
    where: {
      id: loggedInUserId,
    },
    data: {
      isDeleted: true,
    },
    select: {
      id: true,
    },
  });

  if (user) {
    // TODO: 감사합니다. 탈퇴되었습니다. 모달 필요
    await sessionLogout();
    redirect("/");
  }
}