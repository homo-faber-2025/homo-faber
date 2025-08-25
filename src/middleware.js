import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // 세션 확인
  const { data: { session } } = await supabase.auth.getSession();

  // 보호된 라우트들
  const protectedRoutes = ['/mypage', '/admin'];
  const authRoutes = ['/login', '/signup'];

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 보호된 라우트에 접근하려는데 로그인되지 않은 경우
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근하는 경우
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/mypage', request.url));
  }

  return response;
}
