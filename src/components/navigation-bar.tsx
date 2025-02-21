"use client";

import Link from "next/link";
import {ArrowLeftIcon, PencilIcon, TrashIcon} from "@heroicons/react/24/solid";
import {useParams, usePathname} from "next/navigation";

interface NavigationBarProps {
  goBackUrl: string;
  pageTitle?: string;
  postDate?: Date;
}

export default function NavigationBar({goBackUrl, pageTitle, postDate}: NavigationBarProps) {
  const pathname = usePathname();
  const params = useParams();

  return (
    <div className="sticky z-10 left-0 top-0 bg-white w-full h-[49px] flex justify-center items-center py-3 px-5 border-b border-foreground flex-shrink-0">
      <Link href={goBackUrl} className="absolute left-5 top-auto bottom-auto">
        <ArrowLeftIcon className="size-4" />
      </Link>
      <h1 className="font-bold">{pageTitle}</h1>
      {
        pathname === `/calendar/${params.postId}` ?
        <div className="absolute right-5 top-auto bottom-auto flex items-center gap-5">
          <Link href={`/calendar/add?id=${params.postId}&year=${postDate?.getFullYear()}&month=${postDate?.getMonth()}&date=${postDate?.getDate()}`}>
            <PencilIcon className="size-4"/>
          </Link>
          <Link href={`/calendar/delete/${params.postId}`}>
            <TrashIcon className="size-4"/>
          </Link>
        </div> :
        null
      }
    </div>
  );
}