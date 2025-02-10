import Link from "next/link";

export default function NavigationBar() {
  return (
    <div className="relative flex justify-center items-center py-3 px-5 border-b border-gray-200">
      <Link href={``} className="absolute left-5 top-auto bottom-auto">⬅️</Link>
      <h1 className="font-bold">페이지 타이틀</h1>
    </div>
  );
}