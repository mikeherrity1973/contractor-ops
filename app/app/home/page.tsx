'use client';

import Link from 'next/link';
import { FolderOpen, UploadCloud, Clock } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function HomeHub() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO with local gradient only at the top */}
      <div className="relative">
        {/* Gradient layer that fades into the neutral page background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[260px] sm:h-[300px]
                     bg-gradient-to-b from-[#012E4A] via-[#036280] to-transparent"
        />
        <header className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white drop-shadow">
            Welcome to Contractor AI
          </h1>
          <p className="mt-3 max-w-3xl text-white/90 text-lg">
            Your control centre for jobs, uploads, and progress — designed to work great on laptop,
            tablet, and phone.
          </p>
        </header>
      </div>

      {/* MAIN */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        {/* Pull the cards slightly into the gradient area, like before */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-12">
          <Card
            title="Create Projects"
            subtitle="Set up New Contracts"
            actions={
              <Link href="/app#upload">
                <Button>
                  <UploadCloud size={16} /> Create
                </Button>
              </Link>
            }
          >
            <p className="text-sm text-gray-600">
              Add digital twins, Schedule of Works and analyse with AI.
            </p>
          </Card>

          <Card
            title="Manage Projects"
            subtitle="Manage all Properties"
            actions={
              <Link href="/app#jobs">
                <Button>
                  <FolderOpen size={16} /> Open
                </Button>
              </Link>
            }
          >
            <p className="text-sm text-gray-600">Assign Contractors and Schedule Work.</p>
          </Card>

          <Card
            title="Manage Finance"
            subtitle="Manage Sub Contractor Payments"
            actions={
              <Link href="/app/dashboard">
                <Button>
                  <Clock size={16} /> View
                </Button>
              </Link>
            }
          >
            <p className="text-sm text-gray-600">Real Time Financial Position</p>
          </Card>
        </section>
      </main>
    </div>
  );
}
