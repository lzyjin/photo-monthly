"use server";

import {z} from "zod";
import {POST_MEMO_MAX_LENGTH} from "@/lib/constants";
import {db} from "@/lib/db";
import {redirect} from "next/navigation";
import {getDefaultCalendarId} from "@/lib/session";

async function checkPostExists(date: Date, calendarId: number) {
  const post = await db.post.findMany({
    where: {
      date,
      calendarId,
    },
    select: {
      id: true,
    },
  });

  return post;
}

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
  // .superRefine(async (val, ctx) => {
  //   const post = await checkPostExists(val.date, val.calendarId);
  //   console.log(post);
  //
  //   if (post) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       path: ["date"],
  //       message: "선택한 날짜는 이미 사진이 등록되어 있습니다. 다른 날짜를 선택하세요.",
  //       fatal: true,
  //     });
  //
  //     return z.NEVER;
  //   }
  // });

export async function addPost(prevState: unknown, formData: FormData) {
  const data = {
    calendarId: formData.get("calendarId"),
    date: formData.get("date") as string,
    photo: formData.get("photo") as string,
    memo: formData.get("memo") as string,
  };
  console.log(data);

  // if (data.photo instanceof File) {
  //   return {
  //     fieldErrors: {
  //       date: [],
  //       photo: "사진은 필수 항목입니다.",
  //       memo: [],
  //     },
  //     data,
  //   };
  // }

  const result = await formSchema.safeParseAsync(data);
  // console.log(result)

  if (!result.success) {
    console.log(result.error.flatten())
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      data,
    };
  } else {
    // console.log("등록 성공")
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