"use client";

import NavigationBar from "@/components/navigation-bar";
import Form from "next/form";
import Button from "@/components/button";
import {PhotoIcon, XCircleIcon} from "@heroicons/react/24/solid";
import React, {ChangeEvent, useActionState, useEffect, useState} from "react";
import {addPost, getPostedDates, getUploadURL} from "@/app/calendar/add/actions";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {DatepickerInput} from "@/components/datepicker-input";
import {notFound, useSearchParams} from "next/navigation";
import {getMonthEndDate, getMonthStartDate} from "@/lib/utils";

export default function AddPostPage() {
  const searchParams = useSearchParams();

  if (!searchParams.get("year") || !searchParams.get("month") || !searchParams.get("date")) {
    return notFound();
  }

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

  useEffect(() => {
    if (year && month && date) {
      setStartDate(new Date(year, month, date));
    }
  }, [searchParams]);

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

  const interceptAction = async (prevState: unknown, formData: FormData) => {
    const file = formData.get("photo");
    console.log(file)

    if (!file) {
      return;
    }

    // if (file instanceof File && file.size === 0) {
    //   return addPost(prevState, formData);
    // }

    const cloudflareForm = new FormData();
    cloudflareForm.set("file", file);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });

    if (response.status !== 200) {
      return;
    }

    const photoUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_DELIVERY_URL}/${imageId}`;
    formData.set("photo", photoUrl);
    setPhotoPath(`${photoUrl}/public`);

    return addPost(prevState, formData);
  };

  const [state, action] = useActionState(interceptAction, null);

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center">
      <NavigationBar goBackUrl="/calendar" pageTitle="기록 추가"/>

      <div className="p-5 pt-10 flex-auto w-full">
        <Form action={action}>
          <div className="flex flex-col gap-4">

            <div className="w-full">
              <DatePicker
                fixedHeight
                minDate={aYearAgoToday}
                maxDate={new Date()}
                selected={startDate}
                onCalendarOpen={handleCalendarOpen}
                onMonthChange={handleMonthChange}
                showMonthYearDropdown={true}
                dateFormat="yyyy.MM.dd"
                excludeDates={postedDates}
                dayClassName={(date) =>
                  postedDates.some(d => d.getFullYear() === date.getFullYear() &&
                    d.getMonth() === date.getMonth() &&
                    d.getDate() === date.getDate())
                    ? "bg-red-100 rounded-full"
                    : ""
                }
                customInput={<DatepickerInput
                  value={startDate ? startDate.toISOString().split("T")[0] : ""}
                  // errors={state?.fieldErrors.date}
                  // errors={[inputDateWarning]}
                  // defaultValue={state?.data.date}
                />}
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
                // defaultValue={state?.data.photo instanceof File ? undefined : state?.data.photo ?? ""}
                defaultValue={state?.data.photo ?? ""}
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
                      <span className="text-[#ff0000] text-xs">{state?.fieldErrors.photo}</span>
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