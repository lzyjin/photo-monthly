import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
   <div className="w-full h-full flex flex-col justify-between items-center p-5">
     <div className="text-center flex-1 flex justify-center items-center">
       <div>
         <h1 className="text-4xl font-bold mb-5">Photo Monthly</h1>
         <h2 className="text">사진으로 채워가는 달력, <br/>포토 먼슬리</h2>
       </div>
     </div>
     <div className="w-full flex flex-col justify-between items-center gap-5 text-center">
       <div className="w-full flex flex-col justify-between items-center gap-3">
         <Link href={`/login`} className="btn">로그인</Link>
         <Link href={`/create-account`} className="btn">회원가입</Link>
       </div>
       <div className="w-full flex justify-center items-center text-center relative">
         <div className="w-full h-[1px] bg-foreground absolute top-auto left-auto right-auto bottom-auto" />
         <span className="relative bg-white px-3 text-sm">또는</span>
       </div>
       <Link href={`/google/start`} className="btn flex justify-center items-center gap-2">
         <Image src="/icons/google-logo.png" alt="구글 로고" width={20} height={20} />
         <span>Google로 계속하기</span>
       </Link>
     </div>
   </div>
  );
}
