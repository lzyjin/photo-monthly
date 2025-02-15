"use client";

import NavigationBar from "@/components/navigation-bar";
import Form from "next/form";
import Input from "@/components/input";
import Button from "@/components/button";
import {PhotoIcon, XCircleIcon} from "@heroicons/react/24/solid";
import React, {ChangeEvent, useActionState, useEffect, useState} from "react";
import {addPost, getUploadURL} from "@/app/calendar/add/actions";
import Image from "next/image";

export default function AddPostPage() {
  const [photoPath, setPhotoPath] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [imageId, setImageId] = useState("");

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    const photoPreviewUrl = URL.createObjectURL(files[0]);
    setPhotoPath(photoPreviewUrl);

    const {success, result} = await getUploadURL();

    if(success) {
      setUploadUrl(result.uploadURL);
      setImageId(result.id);
    }
  };

  const onDeletePhotoButton = () => {
    setPhotoPath("");
  };

  const interceptAction = async (prevState: unknown, formData: FormData) => {
    const file = formData.get("photo");

    if (!file) {
      return;
    }

    const cloudflareForm = new FormData();
    cloudflareForm.set("file", file);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });

    console.log("클라우드플레어 업로드 결과")
    console.log(response)

    if (response.status !== 200) {
      return;
    }

    const photoUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_DELIVERY_URL}/${imageId}`;
    console.log("🚨✅🥶process.env.CLOUDFLARE_IMAGE_DELIVERY_URL: ", process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_DELIVERY_URL);
    console.log("🚨✅🥶photoUrl: ", photoUrl);
    formData.set("photo", photoUrl);

    return addPost(prevState, formData);
  };

  const [state, action] = useActionState(interceptAction, null);

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center">
      <NavigationBar goBackUrl="/calendar" pageTitle="기록 추가"/>

      <div className="p-5 pt-10 flex-auto w-full">
        <Form action={action}>
          <div className="flex flex-col gap-4">
            {/*<input type="hidden" name="calendarId" value={} />*/}
            <Input
              label="날짜"
              id="date"
              name="date"
              type="date"
              required={true}
              errors={state?.fieldErrors.date}
              defaultValue={state?.data.date}
            />

            <label
              className={`relative w-full aspect-square border border-foreground cursor-pointer
              ${photoPath ? "" : "border-dashed flex justify-center items-center"}
            `}>
              <input
                type="file"
                name="photo"
                className="absolute left-0 top-0 opacity-0 pointer-events-none"
                onChange={onFileChange}
              />
              {/*TODO: 사진 필수 처리 해야함*/}
              {
                photoPath ?
                  <>
                    <Image src={photoPath} alt="img" fill className="object-cover"/>
                    <div className="absolute right-0 top-0 bg-white p-1.5">
                      <XCircleIcon
                        className="size-5 text-foreground"
                        onClick={onDeletePhotoButton}
                      />
                    </div>
                  </> :
                  <>
                    <PhotoIcon className="size-10"/>
                  </>
              }
            </label>

            <div className="flex flex-col gap-3">
              <label htmlFor="memo" className="text-sm">메모</label>
              <div className="w-full h-40 border border-foreground overflow-hidden">
                <textarea
                  name="memo"
                  id="memo"
                  placeholder="사진과 함께 기억하고 싶은 메모를 적어보세요."
                  className="block w-full h-full outline-none border-none p-3 text-sm overflow-y-auto placeholder:text-foreground placeholder:opacity-50"
                  defaultValue={state?.data.memo}
                ></textarea>
              </div>
              {
                state?.fieldErrors.memo && (
                  <div>
                    {
                      state.fieldErrors.memo?.map((error) => (
                        <p key={error} className="text-[#ff0000] text-xs">{error}</p>
                      ))
                    }
                  </div>
                )
              }
            </div>
          </div>

          <div className="fixed max-w-screen-sm z-10 left-1/2 -translate-x-1/2 bottom-0 bg-white w-full p-5">
            <Button text="등록하기"/>
          </div>
        </Form>
      </div>
    </div>
  );
}