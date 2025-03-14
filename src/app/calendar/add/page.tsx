"use client";

import NavigationBar from "@/components/navigation-bar";
import Form from "next/form";
import Button from "@/components/button";
import {PhotoIcon, XCircleIcon} from "@heroicons/react/24/solid";
import React, {ChangeEvent, useActionState, useEffect, useMemo, useState} from "react";
import {addPost, getPostedDates, getUploadURL, updatePost} from "@/app/calendar/add/actions";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {DatepickerInput} from "@/components/datepicker-input";
import {notFound, useSearchParams} from "next/navigation";
import {getMonthEndDate, getMonthStartDate} from "@/lib/utils";
import {getPost, Post} from "@/app/calendar/actions";

export interface FormFieldErrors {
  photo?: string[];
  memo?: string[];
  date?: string[];
  [key: string]: string[] | undefined;
}

export interface FormDataType {
  photo?: string;
  memo?: string;
  date?: string;
  [key: string]: string | undefined;
}

export interface FormState {
  fieldErrors?: FormFieldErrors;
  data?: FormDataType;
}

export default function AddPostPage() {
  const searchParams = useSearchParams();

  const isValid = useMemo(() => {
    return searchParams.get("year") && searchParams.get("month") && searchParams.get("date");
  }, [searchParams]);

  const year = Number(searchParams.get("year"));
  const month = Number(searchParams.get("month"));
  const date = Number(searchParams.get("date"));

  const [photoPath, setPhotoPath] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [imageId, setImageId] = useState("");

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const today = new Date();
  const aYearAgoToday = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
  const [postedDates, setPostedDates] = useState<Date[]>([]);

  const id = searchParams.get("id");
  const [post, setPost] = useState<Post>();

  const handleCalendarOpen = async () => {
    const targetDate = new Date(year, month, date);
    const startDate = getMonthStartDate(targetDate);
    const endDate = getMonthEndDate(targetDate);
    const dates = await getPostedDates(startDate, endDate);
    setPostedDates(dates);
  };

  const handleMonthChange = async (date: Date | null) => {
    if (!date) {
      return;
    }

    const startDate = getMonthStartDate(date);
    const endDate = getMonthEndDate(date);
    const dates = await getPostedDates(startDate, endDate);
    setPostedDates(dates);
  };

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

  const getCloudflareImageUrl = async (file: File) => {
    const cloudflareForm = new FormData();
    cloudflareForm.set("file", file);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });

    if (response.status !== 200) {
      return;
    }

    return `${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_DELIVERY_URL}/${imageId}`;
  }

  const interceptAction = async (prevState: FormState | null, formData: FormData): Promise<FormState | null> => {
    const file = formData.get("photo");

    if (!file || !formData.get("date")) {
      return prevState; // ✅ 항상 값을 반환하도록 수정
    }

    if (id) {
      // 수정모드

      // 기존 이미지 유지
      if (photoPath.includes(process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_DELIVERY_URL!)) {
        formData.set("photo", post?.photo ?? "");
      }

      // 새 파일이 있으면 업로드 후 변경
      if (file instanceof File && file.size > 0) {
        const photoUrl = await getCloudflareImageUrl(file);

        if (photoUrl) {
          formData.set("photo", photoUrl);
          setPhotoPath(`${photoUrl}/public`);
        }
      }

      return updatePost(prevState, formData, id);

    } else {
      // 등록 모드

      // 새 파일이 있으면 업로드 후 변경
      if (file instanceof File && file.size > 0) {
        const photoUrl = await getCloudflareImageUrl(file);

        if (photoUrl) {
          formData.set("photo", photoUrl);
          setPhotoPath(`${photoUrl}/public`);
        }
      }

      return addPost(prevState, formData) as Promise<FormState | null>;
    }
  };

  const [state, action] = useActionState(interceptAction, null);

  useEffect(() => {
    if (!isValid) {
      return;
    }

    if (year && month && date) {
      setStartDate(new Date(year, month, date, 0, 0, 0));
    }

    if (id) {
      (async () => {
        const postData = await getPost(id);
        if (postData) {
          setPost(postData);
        }
      })();
    }

  }, [searchParams, isValid, id, year, month, date]);

  useEffect(() => {
    if (post) {
      setPhotoPath(post.photo + "/public");

    }
  }, [post]);

  // notfound를 return하는 코드는 useActionState 다음에 와야 함
  if (!isValid) {
    return notFound();
  }

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center">
      <NavigationBar goBackUrl={post ? `/calendar/${post.id}` : "/calendar"} pageTitle={post ? "기록 수정" : `기록 추가`} />

      <div className="px-5 pt-10 pb-[120px] flex-auto w-full">
        <Form action={action}>
          <div className="flex flex-col gap-4">

            <div className="w-full">
              <DatePicker
                fixedHeight
                minDate={aYearAgoToday}
                maxDate={new Date()}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                onCalendarOpen={handleCalendarOpen}
                onMonthChange={handleMonthChange}
                showMonthYearDropdown={true}
                dateFormat="yyyy.MM.dd"
                excludeDates={postedDates}
                dayClassName={(date) => postedDates.some(d => d.getFullYear() === date.getFullYear() &&
                  d.getMonth() === date.getMonth() && d.getDate() === date.getDate()) ?
                  "bg-red-100 rounded-full" :
                  ""
                }
                customInput={<DatepickerInput value={startDate ? startDate.toISOString().split("T")[0] : ""} />}
              />
            </div>

            <label
              className={`relative w-full aspect-square border border-foreground cursor-pointer
              ${photoPath ? "" : "border-dashed flex justify-center items-center"}
            `}>
              <input
                type="file"
                name="photo"
                className="absolute left-0 top-0 opacity-0 pointer-events-none"
                onChange={onFileChange}
                defaultValue={state?.data?.photo ?? ""}
                accept="image/*"
              />
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
                    <div className="flex flex-col justify-center items-center gap-2">
                      <PhotoIcon className="size-10"/>
                      <span className="text-[#ff0000] text-xs">{state?.fieldErrors?.photo}</span>
                    </div>
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
                  defaultValue={post ? post.memo! : state?.data?.memo}
                ></textarea>
              </div>
              {
                state?.fieldErrors?.memo && (
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

          <div className="fixed max-w-screen-sm z-10 left-1/2 -translate-x-1/2 bottom-0 bg-white w-full p-5 border-foreground border-t sm:border-l sm:border-r">
            <Button text={post ? "수정하기" : "등록하기"}/>
          </div>
        </Form>
      </div>
    </div>
  );
}