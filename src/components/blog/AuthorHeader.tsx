import React from 'react';
import Image from 'next/image';
import { Calendar, Clock } from 'lucide-react';

interface AuthorHeaderProps {
  name?: string;
  role?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  publishDate?: string;
  readTime?: string;
  className?: string;
}

export function AuthorHeader({
  name = 'Mohamed Siraj',
  role = 'Founder, SecureTools.live',
  avatarUrl = '/images/authors/mohamed-siraj.png',
  linkedinUrl = 'https://www.linkedin.com/in/mohamed-siraj-1a1910234/',
  publishDate,
  readTime,
  className = '',
}: AuthorHeaderProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 text-[13px] text-[#71717a] mb-6 pb-6 border-b border-[#f4f4f5] ${className}`}>
      <div className="flex items-center gap-2">
        <Image
          src={avatarUrl}
          alt={name}
          width={28}
          height={28}
          className="w-[28px] h-[28px] rounded-full object-cover border border-[#e4e4e7]"
        />
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#09090b] hover:text-[#0a66c2] transition-colors inline-flex items-center gap-1.5"
        >
          <span>{name}</span>
          <svg className="w-3.5 h-3.5 fill-[#0a66c2] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8m1.39 9.74v-8.37H5.07v8.37z" />
          </svg>
        </a>
        {role && <span className="text-[#a1a1aa]">({role})</span>}
      </div>
      {publishDate && (
        <>
          <span className="text-[#d4d4d8]">•</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{publishDate.startsWith('Published') ? publishDate : `Published ${publishDate}`}</span>
          </div>
        </>
      )}
      {readTime && (
        <>
          <span className="text-[#d4d4d8]">•</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{readTime}</span>
          </div>
        </>
      )}
    </div>
  );
}
