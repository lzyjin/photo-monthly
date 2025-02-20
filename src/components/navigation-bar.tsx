import Link from "next/link";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";

interface NavigationBarProps {
  goBackUrl: string;
  pageTitle?: string;
}

export default function NavigationBar({goBackUrl, pageTitle}: NavigationBarProps) {
  return (
    <div className="sticky z-10 left-0 top-0 bg-white w-full h-[49px] flex justify-center items-center py-3 px-5 border-b border-foreground flex-shrink-0">
      <Link href={goBackUrl} className="absolute left-5 top-auto bottom-auto">
        <ArrowLeftIcon className="size-5" />
      </Link>
      <h1 className="font-bold">{pageTitle}</h1>
    </div>
  );
}