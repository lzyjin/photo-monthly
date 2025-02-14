import type { Metadata } from "next";
import "./globals.css";
import {jejuGothic, workSans} from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Photo Monthly",
  description: "진으로 채워가는 달력, 포토 먼슬리",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${workSans.variable} ${jejuGothic.variable} `}>
      <body className={`font-worksans antialiased w-full h-full max-w-screen-sm mx-auto max-h-screen  bg-white`}>
        {children}
      </body>
    </html>
  );
}
