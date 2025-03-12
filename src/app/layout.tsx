import type { Metadata } from "next";
import "./globals.css";
import {jejuGothic, workSans} from "@/lib/fonts";
import {Suspense} from "react";

export const metadata: Metadata = {
  title: "Photo Monthly",
  description: "사진으로 채워가는 달력, 포토 먼슬리",
  icons: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🖼️</text></svg>",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${workSans.variable} ${jejuGothic.variable} `}>
      <body className={`font-worksans antialiased w-full max-w-screen-sm min-h-screen mx-auto bg-white 
      sm:border-foreground sm:border-l sm:border-r`}>
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
