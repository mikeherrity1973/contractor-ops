'use client';
import React from 'react';
import { FolderOpen, UploadCloud, PieChart, LogOut } from 'lucide-react';
import { LinkButton, Button, Card } from '@/components/ui';
import { supabase } from '@/lib/supabaseClient';
import Logo from '@/components/Logo';

export default function FinanceHome() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <header className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-semibold tracking-tight">Contractor AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-sm/none opacity-90">Signed in</span>
            <Button
              variant="outline"
              onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
            >
              <LogOut size={16} />
              <span className="text-gray-800">Sign out</span>
            </Button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-semibold">Manage Finance</h1>
          <p className="mt-2 text-white/80 max-w-2xl">Manage sub-contractor payments and see your real-time financial position.</p>
          <div className="h-6" />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-16">
          <Card
            title="Create Projects"
            subtitle="Set up New Contracts"
            actions={<LinkButton href="/app#create"><UploadCloud size={16}/> Create</LinkButton>}
          >
            <p className="text-sm text-gray-600">Add digital twins, Schedule of Works and analyse with AI.</p>
          </Card>
          <Card
            title="Manage Projects"
            subtitle="Manage all Properties"
            actions={<LinkButton href="/app#jobs"><FolderOpen size={16}/> Open</LinkButton>}
          >
            <p className="text-sm text-gray-600">Assign Contractors and Schedule Work.</p>
          </Card>
          <Card
            title="Manage Finance"
            subtitle="Manage Sub Contractor Payments"
            actions={<LinkButton href="/app#items"><PieChart size={16}/> View</LinkButton>}
          >
            <p className="text-sm text-gray-600">Real Time Financial Position</p>
          </Card>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Quick tips">
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Completed items roll into totals automatically.</li>
              <li>Export to reconcile with finance systems.</li>
              <li>Evidence on completion helps with approvals.</li>
            </ul>
          </Card>
          <Card title="What happens next?">
            <p className="text-sm text-gray-700">
              We’ll add a dedicated dashboard here soon. For now, use Items and Export to view values.
            </p>
          </Card>
          <Card title="Links">
            <div className="flex flex-col gap-2 text-sm">
              <a className="underline text-brand-700" href="/app#items">Open items list</a>
              <a className="underline text-brand-700" href="/app#jobs">Open projects</a>
              <a className="underline text-brand-700" href="/app/home">Back to Home</a>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
