import './globals.css';
import React from 'react';

export const metadata = { title: 'Contractor AI', description: 'LLM-powered contractor operations' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-50 text-gray-900">{children}</body>
    </html>
  );
}
