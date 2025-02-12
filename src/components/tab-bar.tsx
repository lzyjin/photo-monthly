"use client";

import Link from "next/link";
import {CalendarDaysIcon, Cog6ToothIcon, PlusCircleIcon} from "@heroicons/react/24/solid";
import {usePathname} from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 bottom-0 bg-white w-full border-t border-foreground flex-shrink-0 text-center
    grid grid-cols-3 *:flex *:flex-col *:justify-center *:items-center *:gap-0.5 *:py-2.5">
      <Link href="/" className={pathname === "/calendar" ? "" : `opacity-50`}>
        <CalendarDaysIcon className="size-5"/>
        <span className="text-xs">캘린더</span>
      </Link>
      <Link href="/calendar/add" className={pathname === "/calendar/add" ? "" : `opacity-50`}>
        <PlusCircleIcon className="size-5"/>
        <span className="text-xs">추가</span>
      </Link>
      <Link href="/setting" className={pathname === "/setting" ? "" : `opacity-50`}>
        <Cog6ToothIcon className="size-5"/>
        <span className="text-xs">설정</span>
      </Link>
    </div>
  );
}