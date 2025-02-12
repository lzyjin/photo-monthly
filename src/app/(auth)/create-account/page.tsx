"use client";

import NavigationBar from "@/components/navigation-bar";
import Input from "@/components/input";
import {createAccount} from "@/app/(auth)/create-account/actions";
import Form from "next/form";
import Button from "@/components/button";
import {useActionState} from "react";
import {NAME_MAX_LENGTH, PASSWORD_MIN_LENGTH} from "@/lib/constants";

export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, null);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <NavigationBar goBackUrl="/" pageTitle="회원가입" />
      <div className="p-5 pt-20 flex-auto w-full">
        <Form action={action} className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <Input
              type="email"
              name="email"
              placeholder="이메일 주소"
              required={true}
              label="이메일"
              errors={state?.fieldErrors.email}
              defaultValue={state?.data.email || ""}
            />
            <Input
              type="text"
              name="name"
              placeholder={`이름(${NAME_MAX_LENGTH}자 이내, 추후 수정 가능)`}
              maxLength={NAME_MAX_LENGTH}
              required={true}
              label="이름"
              errors={state?.fieldErrors.name}
              defaultValue={state?.data.name || ""}
            />
            <Input
              type="password"
              name="password"
              placeholder="비밀번호(영문 대소문자, 숫자, 특수문자 포함 8자 이상)"
              minLength={PASSWORD_MIN_LENGTH}
              required={true}
              label="비밀번호"
              errors={state?.fieldErrors.password}
              defaultValue={state?.data.password || ""}
            />
          </div>
          <Button text="회원가입하기" />
        </Form>
      </div>
    </div>
  );
}