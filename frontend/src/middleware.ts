import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

type UserRole = 'owner' | 'tester';

interface ProfileRoleQuery {
  role: UserRole;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase environment variables are missing during early dev/build, bypass gracefully
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  // 1. Update the Supabase session
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options as CookieOptions)
        );
      },
    },
  });

  const { pathname } = request.nextUrl;
  const isOwnerRoute = pathname.startsWith('/owner');
  const isTesterRoute = pathname.startsWith('/tester');

  // Verify auth session against Supabase Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Check if the user is authenticated. If not, redirect any request for /owner or /tester to /auth
  if (!user && (isOwnerRoute || isTesterRoute)) {
    const authUrl = request.nextUrl.clone();
    authUrl.pathname = '/auth';
    authUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(authUrl);
  }

  // 3. Fetch the user's role and enforce boundaries
  if (user && (isOwnerRoute || isTesterRoute)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<ProfileRoleQuery>();

    const role = profile?.role;

    const copyCookiesAndRedirect = (destination: string): NextResponse => {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = destination;
      redirectUrl.search = '';
      const redirectResponse = NextResponse.redirect(redirectUrl);

      // Preserve refreshed session cookies across the redirect
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });

      return redirectResponse;
    };

    // 4. Enforce strict boundaries:
    // - If role is 'tester' and path starts with /owner, redirect to /tester/dashboard
    // - If role is 'owner' and path starts with /tester, redirect to /owner/dashboard
    if (role === 'tester' && isOwnerRoute) {
      return copyCookiesAndRedirect('/tester/dashboard');
    }

    if (role === 'owner' && isTesterRoute) {
      return copyCookiesAndRedirect('/owner/dashboard');
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/owner/:path*', '/tester/:path*'],
};
