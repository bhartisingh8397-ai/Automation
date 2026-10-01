import React from 'react';
import { SocialPlatform } from '../lib/types';

interface SocialIconProps {
  platform: SocialPlatform | string;
  size?: number;
  className?: string;
  showBadge?: boolean;
}

export const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  size = 20,
  className = '',
  showBadge = false
}) => {
  const p = platform.toLowerCase();

  switch (p) {
    case 'instagram':
      return (
        <span
          className={`inline-flex items-center justify-center rounded-lg shadow-sm ${className}`}
          style={{
            width: size,
            height: size,
            background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          title="Instagram"
        >
          <svg
            width={size * 0.65}
            height={size * 0.65}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </span>
      );

    case 'facebook':
      return (
        <span
          className={`inline-flex items-center justify-center rounded-lg shadow-sm ${className}`}
          style={{
            width: size,
            height: size,
            backgroundColor: '#1877F2',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          title="Facebook"
        >
          <svg
            width={size * 0.65}
            height={size * 0.65}
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </span>
      );

    case 'youtube':
      return (
        <span
          className={`inline-flex items-center justify-center rounded-lg shadow-sm ${className}`}
          style={{
            width: size,
            height: size,
            backgroundColor: '#FF0000',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          title="YouTube"
        >
          <svg
            width={size * 0.65}
            height={size * 0.65}
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </span>
      );

    case 'linkedin':
      return (
        <span
          className={`inline-flex items-center justify-center rounded-lg shadow-sm ${className}`}
          style={{
            width: size,
            height: size,
            backgroundColor: '#0A66C2',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          title="LinkedIn"
        >
          <svg
            width={size * 0.65}
            height={size * 0.65}
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </span>
      );


    default:
      return (
        <span
          className={`inline-flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-300 ${className}`}
          style={{ width: size, height: size }}
        >
          ●
        </span>
      );
  }
};
