import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/account",
  "/account/edit",
  "/account/change-password",
  "/logout",
  "/profile",
];

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (
    protectedRoutes.some((item) => pathname.startsWith(item)) &&
    !accessToken &&
    !refreshToken
  ) {
    return NextResponse.redirect(
      new URL("/auth/login", request.nextUrl.origin),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
