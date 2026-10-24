import React from 'react';
import { Metadata } from 'next';
import WriteForUsClient from './WriteForUsClient';

export const metadata: Metadata = {
  title: 'Write for Us | SecureTools.live',
  description:
    'Share your knowledge about cybersecurity, SaaS, browser extensions, and MCP tools. Submit a guest post or collaborate with SecureTools.',
  alternates: {
    canonical: 'https://securetools.live/write-for-us',
  },
};

export default function WriteForUsPage() {
  return <WriteForUsClient />;
}
