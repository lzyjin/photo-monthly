"use server";

import {z} from "zod";
import {POST_MEMO_MAX_LENGTH} from "@/lib/constants";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import {getDefaultCalendarId} from "@/lib/session";

const formSchema = z.object({
  date: z
    .coerce
    .date(),
  photo: z
    .string({
      required_error: "사진은 필수항목입니다.",
      invalid_type_error: "사진은 필수항목입니다.",
    }),
  memo: z
    .string()
    .max(POST_MEMO_MAX_LENGTH, `${POST_MEMO_MAX_LENGTH}자 이내로 입력해주세요.`),
  });

export async function addPost(prevState: unknown, formData: FormData) {
  const data = {
    date: formData.get("date") as string,
    photo: formData.get("photo") as string,
    memo: formData.get("memo") as string,
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    console.log(result.error.flatten());

    return {
      fieldErrors: result.error.flatten().fieldErrors,
      data,
    };
  } else {
    console.log("등록 성공");

    const calendarId = await getDefaultCalendarId();

    if (!calendarId) {
      return;
    }

    const post = await db.post.create({
      data: {
        calendarId: calendarId,
        date: result.data.date,
        photo: result.data.photo,
        memo: result.data.memo,
      },
      select: {
        id: true,
      }
    });

    redirect(`/calendar/${post.id}`);
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

export async function getPostedDates(searchStartDate: Date, searchEndDate: Date) {
  const calendarId = await getDefaultCalendarId();

  const posts = await db.post.findMany({
    where: {
      calendarId,
      date: {
        gte: searchStartDate,
        lt: searchEndDate,
      },
    },
    select: {
      date: true,
    },
  });

  return posts.map(v => v.date);
}

export async function updatePost(prevState: unknown, formData: FormData, id: string) {
  const data = {
    date: formData.get("date") as string,
    photo: formData.get("photo") as string,
    memo: formData.get("memo") as string,
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    console.log(result.error.flatten())

    return {
      fieldErrors: result.error.flatten().fieldErrors,
      data,
    };
  } else {
    console.log("수정 성공")

    const post = await db.post.update({
      where: {
        id: Number(id),
      },
      data: {
        date: result.data.date,
        photo: result.data.photo,
        memo: result.data.memo,
      },
      select: {
        id: true,
      }
    });

    redirect(`/calendar/${post.id}`);
  }
}
