import {ChevronRightIcon, UserIcon} from "@heroicons/react/24/solid";
import Link from "next/link";

export default function SettingPage() {
  return (
    <div className="w-full h-full p-5">
      <div className="flex flex-col *:border-b *:border-foreground *:text-sm *:py-3 *:flex *:items-center *:justify-between">
        <Link href="/profile" className="border-t border-foreground">
          <div className="flex items-center gap-2">
            <UserIcon className="size-5" />
            <span>내 프로필</span>
          </div>
          <ChevronRightIcon className="size-4" />
        </Link>
        {/*<Link href={``}>*/}
        {/*  <span>일요일 시작</span>*/}
        {/*  <ToggleButton />*/}
        {/*</Link>*/}
        {/*<Link href={``}>*/}
        {/*  <span>언어 설정</span>*/}
        {/*  <div className="flex items-center gap-2">*/}
        {/*    <span>한국어</span>*/}
        {/*    <ChevronRightIcon className="size-4" />*/}
        {/*  </div>*/}
        {/*</Link>*/}
      </div>
    </div>
  );
}