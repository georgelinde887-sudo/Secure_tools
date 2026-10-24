import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /ism and /api/ism routes with strict @sendnow.live guard
  if (pathname.startsWith('/ism') || pathname.startsWith('/api/ism')) {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAuthorized = user?.email && user.email.toLowerCase().endsWith('@sendnow.live');

    // If unauthorized or regular user, redirect immediately to home page with zero leakage
    if (!isAuthorized) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }

    return supabaseResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ism', '/ism/:path*', '/api/ism/:path*'],
};
