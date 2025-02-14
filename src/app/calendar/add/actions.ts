"use server";

import {z} from "zod";
import {POST_MEMO_MAX_LENGTH} from "@/lib/constants";
import {db} from "@/lib/db";
import {getLoggedInUserId} from "@/lib/session";
import {redirect} from "next/navigation";

const formSchema = z.object({
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
    date: formData.get("date") as string,
    photo: formData.get("photo") as string,
    memo: formData.get("memo") as string,
  };
  console.log(data);

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      data,
    };
  } else {
    // console.log("기록 추가 성공 !!!")
    // const loggedInUserId = await getLoggedInUserId();
    // const user = await db.user.findUnique({
    //   where: {
    //     id: loggedInUserId,
    //   },
    //   select: {
    //
    //   }
    // })

    // TODO: 유저 회원가입할 때 calendar 한개 무조건 생기게 추가해야함.
    // TODO: 그리고 기록 추가할 떄 캘린더 여러개인 유저는 캘린더 아이디 넘겨줘야함..
    // 일단 지금은 1로 고정 ..
    await db.post.create({
      data: {
        date: result.data.date,
        photo: result.data.photo,
        memo: result.data.memo,
        calendarId: 1,
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