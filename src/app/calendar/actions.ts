"use server";

import {db} from "@/lib/db";
import {Prisma} from "@prisma/client";

export async function getPost(postId: string) {
  const post = await db.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  return post;
}

export type Post = Prisma.PromiseReturnType<typeof getPost>;