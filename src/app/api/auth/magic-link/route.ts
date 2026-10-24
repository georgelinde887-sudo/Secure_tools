import { NextResponse } from 'next/server';
import { isBusinessEmail } from '@/lib/auth/business-email';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, next = '/dashboard' } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 1. Strict Server-Side Business Email Domain Enforcement
    const validation = isBusinessEmail(email);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.reason },
        { status: 400 }
      );
    }

    // 2. Determine redirect URL
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const emailRedirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

    // 3. Send Supabase Auth Magic Link
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo,
        shouldCreateUser: true,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Failed to send secure sign-in link.' },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A secure sign-in link has been sent to ${email.trim()}. Please check your inbox and click the link to proceed.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred while processing your sign-in request.' },
      { status: 500 }
    );
  }
}
