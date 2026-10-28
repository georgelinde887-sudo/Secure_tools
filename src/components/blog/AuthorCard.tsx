import React from 'react';
import Image from 'next/image';

interface AuthorCardProps {
  name?: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  className?: string;
}

export function AuthorCard({
  name = 'Mohamed Siraj',
  bio = 'Mohamed is the founder of SecureTools.live. He leads the team in building secure, compliant, and privacy-first directory tooling for software teams, finance professionals, and enterprise security leaders worldwide.',
  avatarUrl = '/images/authors/mohamed-siraj.png',
  linkedinUrl = 'https://www.linkedin.com/in/mohamed-siraj-1a1910234/',
  className = '',
}: AuthorCardProps) {
  return (
    <div className={`rounded-2xl border border-[#e4e4e7] bg-[#fafafa] p-6 sm:p-7 flex flex-col sm:flex-row items-start gap-4 sm:gap-5 shadow-xs ${className}`}>
      <div className="relative shrink-0">
        <Image
          src={avatarUrl}
          alt={name}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover border border-[#e4e4e7] shadow-2xs"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[16px] sm:text-[17px] text-[#09090b] tracking-tight">
          {`About the Author: ${name}`}
        </h3>
        <p className="text-[13.5px] sm:text-[14px] text-[#52525b] mt-1.5 leading-relaxed">
          {bio}
        </p>
        {linkedinUrl && (
          <div className="mt-3.5">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] sm:text-[13.5px] font-semibold text-[#0a66c2] hover:text-[#004182] hover:underline transition-colors group"
            >
              <svg className="w-4 h-4 fill-[#0a66c2] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8m1.39 9.74v-8.37H5.07v8.37z" />
              </svg>
              <span>Connect on LinkedIn</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
