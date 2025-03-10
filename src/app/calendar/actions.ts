"use server";

import {db} from "@/lib/db";
import {Prisma} from "@prisma/client";
import {redirect} from "next/navigation";

export async function getPost(postId: string) {
  const post = await db.post.findUnique({
    where: {
      id: Number(postId),
      isDeleted: false,
    },
  });

  return post;
}

export type Post = Prisma.PromiseReturnType<typeof getPost>;

export async function deletePost(postId: string) {
  await db.post.update({
    where: {
      id: Number(postId),
    },
    data: {
      isDeleted: true,
    },
    select: {
      id: true,
    },
  });

  redirect("/calendar");
}