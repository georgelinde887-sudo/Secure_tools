import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // If "next" is in param, use it as redirect URL
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignored if called from a route handler where response headers are set
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { getAdminClient } = await import('@/lib/supabase/admin');
          const admin = getAdminClient();
          const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '127.0.0.1';
          const userAgent = request.headers.get('user-agent') || 'Browser';
          await admin.from('audit_logs').insert({
            actor_email: user.email || 'unknown',
            action: user.app_metadata?.provider === 'google' ? 'AUTH_OAUTH_SIGNIN' : 'AUTH_SESSION_SIGNIN',
            target_id: user.id,
            target_type: 'user',
            ip_address: ip,
            user_agent: userAgent,
            metadata: { provider: user.app_metadata?.provider || 'email', email_verified: !!user.email_confirmed_at },
          } as any);
        }
      } catch (logErr) {
        console.error('Audit log write error:', logErr);
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Return to signin with error
  return NextResponse.redirect(`${origin}/login?error=Authentication%20failed`);
}
