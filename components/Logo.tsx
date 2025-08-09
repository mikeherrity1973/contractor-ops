'use client';
import React from 'react';

export default function Logo({ size = 28 }: { size?: number }) {
  // Simple "CAI" hexagon-ish mark
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="6" y="6" width="36" height="36" rx="10" className="fill-brand-700"/>
      <path d="M16 30c1.8 2.6 4.9 4.3 8.3 4.3 5.6 0 10.1-4.5 10.1-10.1S29.9 14 24.3 14c-3.4 0-6.5 1.7-8.3 4.3" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="3" className="fill-white"/>
    </svg>
  );
}
