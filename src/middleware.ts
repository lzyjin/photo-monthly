import {NextRequest, NextResponse} from "next/server";
import {getLoggedInUserId} from "@/lib/session";

interface PublicUrlsType {
  [key: string]: boolean;
}

const publicUrls: PublicUrlsType = {
  "/": true,
  "/create-account": true,
  "/login": true,
  "/google/start": true,
  "/google/end": true,
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublicUrls = publicUrls[pathname];
  const loggedInUserId = await getLoggedInUserId();

  // 로그인  -> public url 접근 불가
  if (loggedInUserId && isPublicUrls) {
    return NextResponse.redirect(new URL("/calendar", request.url));
  }

  // 로그인 x -> public url 외 접근 불가
  if (!loggedInUserId && !isPublicUrls) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!public|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}