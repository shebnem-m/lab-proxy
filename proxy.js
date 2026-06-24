import { NextResponse } from 'next/server';

export async function proxy(request) {
  const cookieName = 'token';
  const token = request.cookies.get(cookieName)?.value;
  const { pathname } = request.nextUrl;
  if (token && pathname === '/auth') {
  return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (!token && pathname === '/auth') {
    return NextResponse.next();
  }
  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    const response = await fetch('http://127.0.0.1:8080/api/me', {
      headers: {
        'Cookie': `${cookieName}=${token}`,
      },
    });
     
    if (!response.ok) {
      const res = NextResponse.redirect(new URL('/auth', request.url));
      res.cookies.delete(cookieName);
      return res;
    }

    // const user = await response.json();

    // if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
    //   return NextResponse.redirect(new URL('/dashboard', request.url));
    // }

  } catch (error) {
    console.error("Proxy fetch error:", error);
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/admin', '/auth'],
};