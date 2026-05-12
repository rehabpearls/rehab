import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const path = request.nextUrl.pathname;

  // Supabase
  const supabase = createServerClient(
    process.env["NEXT_PUBLIC_SUPABASE_URL"]!,
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach((cookie) =>
            res.cookies.set(cookie.name, cookie.value)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && path.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Token auth
  const accessToken = request.cookies.get("sb-access-token")?.value;

  const isAuthPage =
    path.startsWith("/login") || path.startsWith("/register");

  const isProtectedPage =
    path.startsWith("/dashboard") || path.startsWith("/admin");

  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!accessToken && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
