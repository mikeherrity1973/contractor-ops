'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card } from '@/components/ui';
import { pounds } from '@/utils/money';

type Totals = { totalPence: number; completedPence: number; countAll: number; countCompleted: number };

function Donut({ value, total, label }: { value: number; total: number; label: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const radius = 48, stroke = 10, C = 2 * Math.PI * radius;
  const dash = (pct / 100) * C;
  return (
    <div className="flex items-center gap-4">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
        <circle cx="60" cy="60" r={radius} stroke="#2563eb" strokeWidth={stroke} fill="none"
                strokeDasharray={`${dash} ${C - dash}`} transform="rotate(-90 60 60)" strokeLinecap="round"/>
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-gray-900 text-lg font-semibold">{pct}%</text>
      </svg>
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-lg font-semibold">{pct}%</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [t, setT] = useState<Totals>({ totalPence: 0, completedPence: 0, countAll: 0, countCompleted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from('line_items').select('total_pence,status');
      if (!error && data) {
        const totalPence = data.reduce((s, r: any) => s + (r.total_pence || 0), 0);
        const completed = data.filter((r: any) => r.status === 'Completed');
        const completedPence = completed.reduce((s, r: any) => s + (r.total_pence || 0), 0);
        setT({ totalPence, completedPence, countAll: data.length, countCompleted: completed.length });
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Contract value (completed vs total)">
          <div className="flex items-center justify-between">
            <Donut value={t.completedPence} total={t.totalPence} label="£ completed" />
            <div className="text-right">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-lg font-semibold">{pounds(t.completedPence / 100)}</div>
              <div className="text-sm text-gray-600 mt-2">Total</div>
              <div className="text-lg font-semibold">{pounds(t.totalPence / 100)}</div>
            </div>
          </div>
        </Card>

        <Card title="Line items (completed vs total)">
          <div className="flex items-center justify-between">
            <Donut value={t.countCompleted} total={t.countAll} label="items completed" />
            <div className="text-right">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-lg font-semibold">{t.countCompleted}</div>
              <div className="text-sm text-gray-600 mt-2">Total</div>
              <div className="text-lg font-semibold">{t.countAll}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
