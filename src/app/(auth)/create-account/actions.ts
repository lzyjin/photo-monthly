"use server";

import {z} from "zod";
import {NAME_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REGEX} from "@/lib/constants";
import {db} from "@/lib/db";
import bcrypt from "bcrypt";
import {redirect} from "next/navigation";
import {getLoggedInUserId} from "@/lib/session";

async function checkUserExists(email: string) {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  return user;
}

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .max(NAME_MAX_LENGTH, `${NAME_MAX_LENGTH}자 이내로 입력해주세요`),
  email: z
    .string()
    .email("이메일 형식으로 입력해주세요")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .trim()
    .min(PASSWORD_MIN_LENGTH, `${PASSWORD_MIN_LENGTH}자 이상 입력해주세요.`)
    .regex(PASSWORD_REGEX, `영문 대소문자, 숫자, 특수문자를 포함해 ${PASSWORD_MIN_LENGTH}자 이상 입력해주세요.`)
  })
  .superRefine(async (val, ctx) => {
    const user = await checkUserExists(val.email);

    if (user) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "이미 존재하는 이메일입니다.",
        fatal: true,
      });

      return z.NEVER;
    }

  });

export async function createAccount(prevState: unknown, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
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
    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const user = await db.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      const calendar = await db.calendar.create({
        data: {
          userId: user.id,
          name: "기본 캘린더",
          isDefault: true,
        },
        select: {
          id: true,
        }
      });
    }

    redirect("/login");

  }

}