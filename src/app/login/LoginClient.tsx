'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Mail01Icon, ArrowRight01Icon, AlertCircleIcon, CheckmarkCircle02Icon, LockIcon, ShieldUserIcon } from 'hugeicons-react';

export function LoginClient() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const initialError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [sentSuccess, setSentSuccess] = useState<string | null>(null);

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const origin = window.location.origin;
      const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Google sign-in.');
      setGoogleLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSentSuccess(null);
    if (!email.trim()) {
      setError('Please enter your business email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send magic link.');
      setSentSuccess(data.message || `A secure sign-in link has been sent to ${email}.`);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#fafafa] font-geist">
      <div className="w-full max-w-sm">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-7">
          <Link href="/" className="flex items-center justify-center mb-5 hover:opacity-90 transition-opacity">
            <Image
              src="/securetools-logo.png"
              alt="SecureTools"
              width={160}
              height={36}
              className="h-[38px] w-auto object-contain"
              unoptimized
            />
          </Link>
          <h1 className="text-[22px] font-bold tracking-tight text-[#09090b] text-center">
            Sign in to your account
          </h1>
          <p className="text-[12.5px] text-[#71717a] text-center mt-1.5 max-w-xs">
            Access your software submissions, listings dashboard, and editorial status.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e4e4e7] p-6 shadow-sm">
          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-xl border border-[#fca5a5] bg-[#fff5f5] text-[12px] text-[#991b1b] flex items-start gap-2.5">
              <AlertCircleIcon size={15} className="text-[#ef4444] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Success state */}
          {sentSuccess ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] flex items-center justify-center mx-auto">
                <CheckmarkCircle02Icon size={24} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-[#09090b]">Check your inbox!</h2>
                <p className="text-[12.5px] text-[#52525b] mt-1.5 leading-relaxed">{sentSuccess}</p>
              </div>
              <button
                type="button"
                onClick={() => { setSentSuccess(null); setEmail(''); }}
                className="text-[12px] font-medium text-[#71717a] hover:text-[#09090b] underline underline-offset-4 cursor-pointer"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                className="w-full h-10 rounded-xl border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[#09090b] font-semibold text-[13px] flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{googleLoading ? 'Redirecting...' : 'Continue with Google'}</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center">
                <div className="flex-1 border-t border-[#e4e4e7]" />
                <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-[#a1a1aa]">or</span>
                <div className="flex-1 border-t border-[#e4e4e7]" />
              </div>

              {/* Magic Link */}
              <form onSubmit={handleMagicLinkSubmit} className="space-y-3">
                <div>
                  <label htmlFor="business-email" className="block text-[12px] font-semibold text-[#09090b] mb-1.5">
                    Work / Business Email
                  </label>
                  <input
                    id="business-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full h-10 px-3.5 rounded-xl border border-[#e4e4e7] bg-white text-[13px] text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] transition-colors"
                  />
                  <p className="text-[11px] text-[#a1a1aa] mt-1.5 leading-relaxed">
                    Personal emails (Gmail, Yahoo, Outlook) are restricted — use the Google button above.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full h-10 rounded-xl bg-[#09090b] hover:bg-black/85 text-white font-semibold text-[13px] flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-60"
                >
                  <Mail01Icon size={14} strokeWidth={2} />
                  <span>{loading ? 'Sending link...' : 'Send Magic Link'}</span>
                  {!loading && <ArrowRight01Icon size={13} strokeWidth={2} />}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-[#a1a1aa]">
          <span className="flex items-center gap-1">
            <LockIcon size={11} />
            Passwordless secure
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <ShieldUserIcon size={11} />
            No password stored
          </span>
        </div>

        <p className="text-center text-[11.5px] text-[#a1a1aa] mt-4">
          Need help?{' '}
          <Link href="/contact" className="text-[#09090b] font-medium hover:underline underline-offset-2">
            Contact support
          </Link>
        </p>
      </div>
    </div>
  );
}
