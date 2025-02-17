"use server";

import {z} from "zod";
import {POST_MEMO_MAX_LENGTH} from "@/lib/constants";
import {db} from "@/lib/db";
import {getLoggedInUserId} from "@/lib/session";
import {redirect} from "next/navigation";

const formSchema = z.object({
  calendarId: z
    .coerce
    .number(),
  date: z
    .coerce
    .date(),
  photo: z
    .string(),
  memo: z
    .string()
    .max(POST_MEMO_MAX_LENGTH, `${POST_MEMO_MAX_LENGTH}자 이내 입력해주세요.`),
  });

export async function addPost(prevState: unknown, formData: FormData) {
  const data = {
    calendarId: formData.get("calendarId"),
    date: formData.get("date") as string,
    photo: formData.get("photo"),
    memo: formData.get("memo") as string,
  };
  console.log(data);

  if (data.photo instanceof File) {
    return {
      fieldErrors: {
        date: [],
        photo: "사진은 필수 항목입니다.",
        memo: [],
      },
      data,
    };
  }

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      data,
    };
  } else {
    await db.post.create({
      data: {
        calendarId: result.data.calendarId,
        date: result.data.date,
        photo: result.data.photo,
        memo: result.data.memo,
      },
      select: {
        id: true,
      }
    });

    redirect("/calendar");
  }

}

export async function getUploadURL() {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    }
  });

  const data = await response.json();

  return data;
}

