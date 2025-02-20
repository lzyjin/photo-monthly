"use server";

import {db} from "@/lib/db";

export async function getPost(postId: string) {
  const post = await db.post.findUnique({
    where: {
      id: Number(postId),
    },
  });

  return post;
}