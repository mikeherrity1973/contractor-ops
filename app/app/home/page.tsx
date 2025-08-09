'use client';
import React from 'react';
import { FolderOpen, UploadCloud, PieChart, LogOut } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import Logo from '@/components/Logo';

export default function HomeHub() {
  return (
    <div className="min-h-screen">
      {/* Gradient header */}
      <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <header className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-semibold tracking-tight">Contractor AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm/none opacity-90">Signed in</span>
            <Button variant="outline"><LogOut size={16}/> <span className="text-gray-800">Sign out</span></Button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-semibold">Welcome to <span className="text-white/90">Contractor AI</span></h1>
          <p className="mt-2 text-white/80 max-w-2xl">Your control centre for jobs, uploads, and progress — designed to work great on laptop, tablet, and phone.</p>
          <div className="h-6" />
        </div>
      </div>

      {/* Body */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-16">
          <Card title="View Projects" subtitle="Browse all properties/jobs"
            actions={<Button href="/app#jobs"><FolderOpen size={16}/> Open</Button>}>
            <p className="text-sm text-gray-600">See the list of projects and open one.</p>
          </Card>
          <Card title="Add Project" subtitle="Upload a Schedule of Works"
            actions={<Button href="/app#upload"><UploadCloud size={16}/> Add</Button>}>
            <p className="text-sm text-gray-600">Create a new project by uploading an XLSX.</p>
          </Card>
          <Card title="Dashboard" subtitle="At-a-glance totals"
            actions={<Button href="/app/dashboard"><PieChart size={16}/> View</Button>}>
            <p className="text-sm text-gray-600">Totals and completion progress.</p>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Quick tips">
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Use <span className="font-mono">CODE</span> and <span className="font-mono">DESCRIPTION</span> columns in your XLSX.</li>
              <li>Carpet NONSOR auto-locks to £32.10 per unit.</li>
              <li>Assign a contractor and mark items <em>Started</em> or <em>Completed</em>.</li>
            </ul>
          </Card>
          <Card title="What happens next?">
            <p className="text-sm text-gray-700">Dashboard shows total value and completion. Use View Projects to drill into a property and manage line items.</p>
          </Card>
          <Card title="Links">
            <div className="flex flex-col gap-2 text-sm">
              <a className="underline text-brand-700" href="/app#jobs">Open projects</a>
              <a className="underline text-brand-700" href="/app#upload">Add a new project</a>
              <a className="underline text-brand-700" href="/app">Workspace</a>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
