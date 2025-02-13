"use client";

import NavigationBar from "@/components/navigation-bar";
import Input from "@/components/input";
import Form from "next/form";
import Button from "@/components/button";
import {useActionState} from "react";
import {PASSWORD_MIN_LENGTH} from "@/lib/constants";
import {login} from "@/app/(auth)/login/actions";

export default function LoginPage() {
  const [state, action] = useActionState(login, null);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <NavigationBar goBackUrl="/" pageTitle="로그인" />
      <div className="p-5 pt-20 flex-auto w-full">
        <Form action={action} className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <Input
              type="email"
              name="email"
              placeholder=""
              required={true}
              label="이메일"
              errors={state?.fieldErrors.email}
              defaultValue={state?.data.email || ""}
            />
            <Input
              type="password"
              name="password"
              placeholder=""
              minLength={PASSWORD_MIN_LENGTH}
              required={true}
              label="비밀번호"
              errors={state?.fieldErrors.password}
              defaultValue={state?.data.password || ""}
            />
          </div>
          <Button text="로그인하기" />
        </Form>
      </div>
    </div>
  );
}