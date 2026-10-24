import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { LoginClient } from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign In | SecureTools.live',
  description: 'Sign in to SecureTools using Google OAuth or your business email magic link.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto px-4 py-16 text-center text-[13px] text-[#71717a]">
        Loading sign in...
      </div>
    }>
      <LoginClient />
    </Suspense>
  );
}
