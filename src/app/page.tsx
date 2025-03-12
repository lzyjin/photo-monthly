import Link from "next/link";

export default function Home() {
  return (
   <div className="w-full h-screen flex flex-col justify-between items-center p-5">
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
     </div>
   </div>
  );
}
