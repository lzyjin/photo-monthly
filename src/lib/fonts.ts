import {Work_Sans} from "next/font/google";
import localFont from 'next/font/local';

export const workSans = Work_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900",],
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const jejuGothic = localFont({
  src: "../../public/fonts/JejuGothic.woff",
  variable: "--font-jeju-gothic",
  display: "swap",
});