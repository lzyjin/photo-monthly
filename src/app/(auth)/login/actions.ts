"use server";

import {z} from "zod";
import {db} from "@/lib/db";
import bcrypt from "bcrypt";
import {redirect} from "next/navigation";
import {PASSWORD_MIN_LENGTH} from "@/lib/constants";
import {sessionLogin, sessionSetDefaultCalendar} from "@/lib/session";

async function checkUserExists(email: string) {
  const user = await db.user.findUnique({
    where: {
      email,
      isDeleted: false,
    },
    select: {
      id: true,
      password: true,
    },
  });

  return user;
}

const formSchema = z.object({
  email: z
    .string()
    .email("이메일 형식으로 입력해주세요")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .trim()
    .min(PASSWORD_MIN_LENGTH, `${PASSWORD_MIN_LENGTH}자 이상 입력해주세요.`),
  })
  .superRefine(async (val, ctx) => {
    const user = await checkUserExists(val.email);

    if (!user) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "존재하지 않는 이메일입니다. 회원가입 해주세요.",
        fatal: true,
      });

      return z.NEVER;
    }

  });

export async function login(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      data,
    };

  } else {
    const user = await checkUserExists(result.data.email);

    if (!user) {
      return;
    }

    const ok = await bcrypt.compare(result.data.password, user.password);

    if (ok) {
      await sessionLogin(user.id);

      const calendars = await db.calendar.findMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        select: {
          id: true,
        },
      });

      await sessionSetDefaultCalendar(calendars[0].id);

      redirect(`/calendar/${calendars[0].id}`);

    } else {
      return {
        fieldErrors: {
          password: ["비밀번호가 다릅니다."],
        },
        data: result.data,
      };

    }
  }
}