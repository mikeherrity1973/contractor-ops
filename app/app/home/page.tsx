'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FolderOpen, UploadCloud, PieChart } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function HomeHub() {
  const router = useRouter();

  return (
    <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Decorative gradient band only at the very top */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-x-0 top-0 -z-10
          h-[260px]
          bg-[radial-gradient(120%_70%_at_50%_0%,var(--brand-900)_0%,var(--brand-700)_45%,transparent_75%)]
        "
      />

      {/* Hero */}
      <header className="pb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white drop-shadow-sm">
          Welcome to Contractor AI
        </h1>
        <p className="mt-2 text-white/90">
          Your control centre for jobs, uploads, and progress — designed to work great
          on laptop, tablet, and phone.
        </p>
      </header>

      {/* Primary actions */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-4">
        {/* Create Projects (left) */}
        <Card
          title="Create Projects"
          subtitle="Set up New Contracts"
          actions={
            <Button onClick={() => router.push('/app#upload')}>
              <UploadCloud size={16} /> Create
            </Button>
          }
        >
          <p className="text-sm text-gray-600">
            Add digital twins, Schedule of Works and analyse with AI.
          </p>
        </Card>

        {/* Manage Projects (middle) */}
        <Card
          title="Manage Projects"
          subtitle="Manage all Properties"
          actions={
            <Button onClick={() => router.push('/app#jobs')}>
              <FolderOpen size={16} /> Open
            </Button>
          }
        >
          <p className="text-sm text-gray-600">Assign Contractors and Schedule Work.</p>
        </Card>

        {/* Manage Finance (right) */}
        <Card
          title="Manage Finance"
          subtitle="Manage Sub Contractor Payments"
          actions={
            <Button onClick={() => router.push('/app#items')}>
              <PieChart size={16} /> View
            </Button>
          }
        >
          <p className="text-sm text-gray-600">Real Time Financial Position</p>
        </Card>
      </section>

      {/* Secondary content (unchanged) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card title="Quick tips">
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            <li>
              Use <span className="font-mono">CODE</span> and{' '}
              <span className="font-mono">DESCRIPTION</span> columns in your XLSX.
            </li>
            <li>Carpet NONSOR auto-locks to £32.10 per unit.</li>
            <li>Assign a contractor and mark items Started or Completed.</li>
          </ul>
        </Card>

        <Card title="What happens next?">
          <p className="text-sm text-gray-700">
            Dashboard shows total value and completion. Use Manage Projects to drill
            into a property and manage line items.
          </p>
        </Card>

        <Card title="Links">
          <div className="flex flex-col gap-2 text-sm">
            <a className="underline text-blue-700" href="/app#jobs">Open projects</a>
            <a className="underline text-blue-700" href="/app#upload">Create project</a>
            <a className="underline text-blue-700" href="/app">Workspace</a>
          </div>
        </Card>
      </section>
    </main>
  );
}
