import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
   <div className="w-full h-full flex flex-col justify-between items-center p-5">
     <div className="text-center flex-1 flex justify-center items-center">
       <div>
         <h1 className="text-4xl font-bold mb-3">Photo Monthly</h1>
         <h2 className="text-lg font-semibold">사진으로 채워가는 달력, <br/>포토 먼슬리</h2>
       </div>
     </div>
     <div className="w-full flex flex-col justify-between items-center gap-5 text-center">
       <div className="w-full flex flex-col justify-between items-center gap-2">
         <Link href={`/login`} className="w-full py-2 block border border-blue-500 bg-blue-500 rounded-md text-white font-semibold">로그인</Link>
         <Link href={`/create-account`} className="w-full py-2 block border border-blue-500 rounded-md text-blue-500 font-semibold">회원가입</Link>
       </div>
       <div className="w-full flex justify-center items-center text-center relative">
         <div className="w-full h-[1px] bg-gray-300 absolute top-auto left-auto right-auto bottom-auto" />
         <span className="relative bg-white px-3">또는</span>
       </div>
       <Link href={`/google/start`} className="w-full py-2 border border-black rounded-md text-black font-semibold flex justify-center items-center gap-2">
         <Image src="/icon/google-logo.png" alt="구글 로고" width={20} height={20} />
         <span>Google로 계속하기</span>
       </Link>
     </div>
   </div>
  );
}
