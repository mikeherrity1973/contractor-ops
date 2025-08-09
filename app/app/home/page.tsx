'use client';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';

export default function HomeHub() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Welcome to Contractor Ops</h1>
        <p className="text-gray-600 mt-1">Choose an action to get started.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="View Projects" subtitle="Browse all properties/jobs" actions={
          <Link href="/app#jobs"><Button>Open</Button></Link>
        }>
          <p className="text-sm text-gray-600">See the list of projects and open one.</p>
        </Card>

        <Card title="Add Project" subtitle="Upload a Schedule of Works" actions={
          <Link href="/app#upload"><Button>Add</Button></Link>
        }>
          <p className="text-sm text-gray-600">Upload a spreadsheet to create a new project.</p>
        </Card>

        <Card title="Dashboard" subtitle="At-a-glance totals" actions={
          <Link href="/app/dashboard"><Button>View</Button></Link>
        }>
          <p className="text-sm text-gray-600">Totals and completion progress.</p>
        </Card>
      </div>
    </div>
  );
}
