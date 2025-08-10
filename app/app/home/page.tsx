import React from 'react';
import Link from 'next/link';
import { FolderOpen, UploadCloud, PieChart, LogOut } from 'lucide-react';
import { Button, Card } from '@/components/ui';

export default function HomeHub() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C3A4E] via-[#0F566B] to-[#0F566B]">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white/10 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-white/20" />
            <span className="font-semibold tracking-tight text-white">Contractor AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm text-white/80">Signed in</span>
            <Link href="/"><Button variant="outline"><LogOut size={16}/> Sign out</Button></Link>
          </div>
        </div>
      </header>

      {/* Page body */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-white">
          <h1 className="text-4xl font-bold">Welcome to Contractor AI</h1>
          <p className="mt-2 text-white/80">
            Your control centre for jobs, uploads, and progress — designed to work great on laptop, tablet, and phone.
          </p>
        </div>

        {/* Primary actions (REORDERED + TEXT UPDATED) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-16">
          {/* 1) Create Projects (was Add Project) */}
          <Card
            title="Create Projects"
            subtitle="Set up New Contracts"
            actions={
              <Link href="/app#upload">
                <Button><UploadCloud size={16}/> Create</Button>
              </Link>
            }
          >
            <p className="text-sm text-gray-600">
              Add digital twins, Schedule of Works and analyse with AI.
            </p>
          </Card>

          {/* 2) Manage Projects (was View Projects) */}
          <Card
            title="Manage Projects"
            subtitle="Manage all Properties"
            actions={
              <Link href="/app#jobs">
                <Button><FolderOpen size={16}/> Open</Button>
              </Link>
            }
          >
            <p className="text-sm text-gray-600">
              Assign Contractors and Schedule Work.
            </p>
          </Card>

          {/* 3) Manage Finance (was Dashboard) */}
          <Card
            title="Manage Finance"
            subtitle="Manage Sub Contractor Payments"
            actions={
              <Link href="/app/dashboard">
                <Button><PieChart size={16}/> View</Button>
              </Link>
            }
          >
            <p className="text-sm text-gray-600">
              Real Time Financial Position
            </p>
          </Card>
        </section>

        {/* Lower grid stays unchanged */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Quick tips">
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Use <span className="font-mono">CODE</span> and <span className="font-mono">DESCRIPTION</span> columns in your XLSX.</li>
              <li>Carpet NONSOR auto-locks to £32.10 per unit.</li>
              <li>Assign a contractor and mark items Started or Completed.</li>
            </ul>
          </Card>
          <Card title="What happens next?">
            <p className="text-sm text-gray-700">
              Dashboard shows total value and completion. Use Manage Projects to drill into a property and manage line items.
            </p>
          </Card>
          <Card title="Links">
            <div className="flex flex-col gap-2 text-sm">
              <Link className="underline text-blue-700" href="/app#jobs">Open projects</Link>
              <Link className="underline text-blue-700" href="/app#upload">Create project</Link>
              <Link className="underline text-blue-700" href="/app">Workspace</Link>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
