'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ENV } from '@/lib/env';
import { Button, Card, Input, Select, Badge } from '@/components/ui';
import { parseXlsx, exportXlsx, SheetRow } from '@/utils/xlsx';
import { toPence, fromPence, pounds } from '@/utils/money';

// ---------- Types ----------
type Job = any;

// Keep extendable
const seedCategories = [
  'Gas',
  'Plumbing',
  'Electrics',
  'Handyman',
  'Carpentry',
  'Roofing',
  'Decorating',
  'Flooring',
  'Other',
];

// Badge tone per status (uses brand for "Assigned")
function statusTone(s: string) {
  return (
    {
      Unassigned: 'amber',
      Assigned: 'brand',
      Started: 'violet',
      Completed: 'green',
    } as any
  )[s] || 'gray';
}

export default function AppPage() {
  // ---------- Auth / session ----------
  const [mode] = useState(ENV.AUTH_MODE);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // ---------- Data ----------
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJobId, setActiveJobId] = useState<string>('');
  const activeJob = useMemo(
    () => jobs.find((j) => j.id === activeJobId),
    [jobs, activeJobId]
  );

  const [items, setItems] = useState<any[]>([]);

  // ---------- Initial load ----------
  useEffect(() => {
    (async () => {
      if (mode === 'demo_pin') {
        // Local demo data
        const demo = {
          id: 'demo-1',
          address_line1: '11 Acacia Avenue',
          region: 'Gloucester',
          postcode: 'GL1 2AB',
          order_no: 'ORD-77819',
        };
        setJobs([demo]);
        setActiveJobId(demo.id);
        setItems([
          {
            id: 'i1',
            code: '7300EA',
            description: 'VOID:SAFETY CHECK AND TEST GAS INSTALLATION',
            base_rate_pence: toPence(58.01),
            contract_rate_pence: toPence(65.55),
            unit: 'IT',
            qty: 1,
            total_pence: toPence(65.55),
            location: 'General',
            comments: 'Landlord gas & safety certificate',
            category: 'Gas',
            assignee_name: 'Bristol Boilers',
            status: 'Assigned',
          },
          {
            id: 'i2',
            code: 'NONSOR',
            description: 'CARPET:RENEW TO DOMESTIC AREAS',
            base_rate_pence: toPence(27.91),
            contract_rate_pence: toPence(32.1),
            unit: 'IT',
            qty: 2,
            total_pence: toPence(64.2),
            location: 'Lounge',
            comments: 'Fixed-rate special',
            category: 'Flooring',
            assignee_name: '',
            status: 'Unassigned',
          },
        ]);
        setSessionChecked(true);
        return;
      }

      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = '/';
        return;
      }
      setUserEmail(data.user.email || '');
      setSessionChecked(true);

      // Load jobs newest-first
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && jobsData) {
        setJobs(jobsData);

        // If URL gives ?job=<uuid>, prefer that
        const sp = new URLSearchParams(window.location.search);
        const urlJob = sp.get('job');
        if (urlJob && jobsData.some((j) => j.id === urlJob)) {
          setActiveJobId(urlJob);
        } else if (jobsData[0]) {
          setActiveJobId(jobsData[0].id);
        }
      }
    })();
  }, [mode]);

  // ---------- Load items for a job ----------
  useEffect(() => {
    if (!activeJob || mode === 'demo_pin') return;

    (async () => {
      const { data, error } = await supabase
        .from('line_items')
        .select(
          '*, contractors:assignee_contractor_id(company_name), categories:category_id(name)'
        )
        .eq('job_id', activeJob.id)
        .order('row_index', { ascending: true });

      if (!error && data) {
        setItems(
          data.map((r: any) => ({
            id: r.id,
            code: r.code,
            description: r.description,
            base_rate_pence: r.base_rate_pence,
            contract_rate_pence: r.contract_rate_pence,
            unit: r.unit,
            qty: Number(r.qty),
            total_pence: r.total_pence,
            location: r.location,
            comments: r.comments,
            category: r.categories?.name || 'Other',
            assignee_name: r.contractors?.company_name || '',
            status: r.status,
          }))
        );
      }
    })();
  }, [activeJob?.id, mode]);

  // ---------- XLSX Upload ----------
  async function handleUpload(file: File, property: any) {
    if (mode !== 'demo_pin' && !userEmail)
      return alert('Please log in again.');

    const rows = await parseXlsx(file);

    // Create Job
    let jobId = activeJobId;
    if (mode === 'demo_pin') {
      const newJob = { id: `demo-${Date.now()}`, ...property };
      setJobs((j) => [newJob, ...j]);
      setActiveJobId(newJob.id);
      jobId = newJob.id;
    } else {
      const { data: jobIns, error } = await supabase
        .from('jobs')
        .insert([{ ...property }])
        .select('id')
        .single();
      if (error) return alert(error.message);
      jobId = jobIns.id;
      setJobs((j) => [{ id: jobId, ...property }, ...j]);
      setActiveJobId(jobId);
    }

    // Fetch classification helpers (DB mode)
    let categories: any[] = seedCategories.map((n, i) => ({
      id: `local-${i}`,
      name: n,
    }));
    let rules: any[] = [
      {
        kind: 'NONSOR',
        pattern: 'CARPET:RENEW TO DOMESTIC AREAS',
        categoryName: 'Flooring',
        priority: 1,
      },
    ];
    let defaults: Record<string, string> = {};

    if (mode !== 'demo_pin') {
      const [cat, rule, def] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase
          .from('category_rules')
          .select('*, categories:category_id(name)'),
        supabase
          .from('regional_defaults')
          .select(
            '*, categories:category_id(name), contractors:contractor_id(company_name)'
          ),
      ]);
      if (!cat.error && cat.data) categories = cat.data;
      if (!rule.error && rule.data)
        rules = rule.data.map((r: any) => ({
          kind: r.kind,
          pattern: r.pattern,
          categoryName: r.categories?.name,
          priority: r.priority,
        }));
      if (!def.error && def.data) {
        defaults = Object.fromEntries(
          def.data.map((d: any) => [
            `${d.categories?.name}|${d.region}`,
            d.contractors?.company_name,
          ])
        );
      }
    }

    const norm = (s: string) => (s || '').trim();

    function classify(row: SheetRow): { category: string; needsReview: boolean } {
      const code = norm(row.CODE || '');
      const description = norm(row.DESCRIPTION || '');

      // Exact CODE rule first
      const exact = rules.find((r) => r.kind === 'CODE' && r.pattern === code);
      if (exact) return { category: exact.categoryName, needsReview: false };

      // NONSOR (description contains)
      const lower = description.toLowerCase();
      const match = rules
        .filter((r) => r.kind === 'NONSOR')
        .sort(
          (a: any, b: any) => (a.priority ?? 100) - (b.priority ?? 100)
        )
        .find((r) => lower.includes(String(r.pattern).toLowerCase()));
      if (match) return { category: match.categoryName, needsReview: false };

      return { category: 'Other', needsReview: true };
    }

    // Enforce carpet fixed rate; otherwise check 15% uplift
    function contractRateCheck(
      base: number,
      contract: number,
      code: string,
      description: string
    ) {
      if (code === 'NONSOR' && description === 'CARPET:RENEW TO DOMESTIC AREAS') {
        return { valid: Math.abs(contract - 32.1) < 0.01, fixedRate: 32.1 };
      }
      const expected = base * 1.15;
      return { valid: Math.abs(contract - expected) < 0.01, expected };
    }

    const toInsert: any[] = [];
    rows.forEach((r, idx) => {
      const code = String(r.CODE || '').trim();
      const description = String(r.DESCRIPTION || '').trim();
      if (!code && !description) return;

      const base = Number(r['BASE RATE'] || 0);
      const contract = Number(r['CONTRACT RATE UNIT'] || 0);
      const qty = Number(r.QTY || 0);
      const total = Number(r.TOTAL || contract * qty);

      const { category, needsReview } = classify(r);
      const check = contractRateCheck(base, contract, code, description);

      const location = String(r.LOCATION || '').trim();
      const comments = String(r.COMMENTS || '').trim();

      const region = property?.region || activeJob?.region || '';
      const defaultKey = `${category}|${region}`;
      const defaultAssignee = defaults[defaultKey] || '';

      toInsert.push({
        code,
        description,
        base_rate_pence: toPence(base),
        contract_rate_pence: toPence(check.fixedRate ?? contract),
        unit: String(r.Unit || ''),
        qty,
        total_pence: toPence(check.fixedRate ? check.fixedRate * qty : total),
        location,
        comments,
        category,
        assignee_name: defaultAssignee,
        status: defaultAssignee ? 'Assigned' : 'Unassigned',
        row_index: idx,
        needs_review: needsReview || !check.valid,
      });
    });

    if (mode === 'demo_pin') {
      setItems(
        toInsert.map((x, i) => ({ id: `demo-item-${Date.now()}-${i}`, ...x }))
      );
      alert('Demo upload complete (local only).');
      return;
    }

    // Map category/assignee names to IDs
    const catByName = new Map(categories.map((c: any) => [c.name, c.id]));
    const { data: contractors } = await supabase.from('contractors').select('*');
    const contractorByName = new Map(
      (contractors || []).map((c: any) => [c.company_name, c.id])
    );

    const dbRows = toInsert.map((x) => ({
      job_id: jobId,
      code: x.code,
      description: x.description,
      base_rate_pence: x.base_rate_pence,
      contract_rate_pence: x.contract_rate_pence,
      unit: x.unit,
      qty: x.qty,
      total_pence: x.total_pence,
      location: x.location,
      comments: x.comments,
      category_id: catByName.get(x.category) || null,
      assignee_contractor_id: contractorByName.get(x.assignee_name) || null,
      status: x.status,
      needs_review: x.needs_review,
      row_index: x.row_index,
    }));

    const { error } = await supabase.from('line_items').insert(dbRows);
    if (error) return alert(error.message);

    alert('Upload complete');

    // Reload
    const { data } = await supabase
      .from('line_items')
      .select(
        '*, contractors:assignee_contractor_id(company_name), categories:category_id(name)'
      )
      .eq('job_id', jobId)
      .order('row_index', { ascending: true });

    if (data)
      setItems(
        data.map((r: any) => ({
          id: r.id,
          code: r.code,
          description: r.description,
          base_rate_pence: r.base_rate_pence,
          contract_rate_pence: r.contract_rate_pence,
          unit: r.unit,
          qty: Number(r.qty),
          total_pence: r.total_pence,
          location: r.location,
          comments: r.comments,
          category: r.categories?.name || 'Other',
          assignee_name: r.contractors?.company_name || '',
          status: r.status,
        }))
      );
  }

  // ---------- Update item fields ----------
  async function updateItem(id: string, patch: Partial<any>) {
    if (mode === 'demo_pin') {
      setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
      return;
    }

    const dbPatch: any = {};
    if (patch.status) dbPatch.status = patch.status;

    if (patch.category) {
      const { data: cats } = await supabase.from('categories').select('*');
      const cat = (cats || []).find((c) => c.name === patch.category);
      if (cat) dbPatch.category_id = cat.id;
    }

    if (patch.assignee_name !== undefined) {
      const { data: cons } = await supabase.from('contractors').select('*');
      const c = (cons || []).find((x) => x.company_name === patch.assignee_name);
      dbPatch.assignee_contractor_id = c?.id || null;
      if (patch.assignee_name && patch.status === 'Unassigned')
        dbPatch.status = 'Assigned';
    }

    const { error } = await supabase.from('line_items').update(dbPatch).eq('id', id);
    if (error) return alert(error.message);

    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  // ---------- Evidence upload ----------
  async function addEvidence(id: string, file: File) {
    if (mode === 'demo_pin') {
      alert('Demo mode: not uploading.');
      return;
    }
    const path = `${id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage
      .from('evidence')
      .upload(path, file, { upsert: false });
    if (upErr) return alert(upErr.message);

    const { error: dbErr } = await supabase
      .from('evidence')
      .insert([
        {
          item_id: id,
          type: 'photo',
          file_path: path,
          filename: file.name,
          filesize_bytes: file.size,
        },
      ]);
    if (dbErr) return alert(dbErr.message);

    alert('Evidence uploaded');
  }

  // ---------- Export ----------
  function exportCurrent() {
    const rows = items.map((r: any) => ({
      CODE: r.code,
      DESCRIPTION: r.description,
      'BASE RATE': fromPence(r.base_rate_pence),
      'CONTRACT RATE UNIT': fromPence(r.contract_rate_pence),
      Unit: r.unit,
      QTY: r.qty,
      TOTAL: fromPence(r.total_pence),
      LOCATION: r.location,
      COMMENTS: r.comments,
      ITEM_ID: r.id,
      CATEGORY: r.category,
      ASSIGNEE: r.assignee_name,
      STATUS: r.status,
    }));
    exportXlsx(rows, 'schedule_export.xlsx');
  }

  // ---------- Simple router (Jobs / Upload / Items) ----------
  const [route, setRoute] = useState<'jobs' | 'upload' | 'items'>('items');

  // **Deep-link: read hash + ?job=**
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace('#', '');
    if (hash === 'jobs' || hash === 'upload' || hash === 'items') {
      setRoute(hash as any);
    }
    const sp = new URLSearchParams(window.location.search);
    const job = sp.get('job');
    if (job) setActiveJobId(job);
  }, []);

  // Keep URL hash in sync with the current tab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const current = window.location.hash.replace('#', '');
    if (current !== route) {
      const u = new URL(window.location.href);
      u.hash = `#${route}`;
      window.history.replaceState(null, '', u.toString());
    }
  }, [route]);

  // Keep ?job=<id> in sync with the selected job
  useEffect(() => {
    if (typeof window === 'undefined' || !activeJobId) return;
    const u = new URL(window.location.href);
    u.searchParams.set('job', activeJobId);
    window.history.replaceState(null, '', u.toString());
  }, [activeJobId]);

  // ---------- Upload form state ----------
  const [file, setFile] = useState<File | null>(null);
  const [property, setProperty] = useState<any>({ region: 'Gloucester' });

  // ---------- Totals ----------
  const completeValue = useMemo(
    () =>
      items
        .filter((r) => r.status === 'Completed')
        .reduce((s, r) => s + r.total_pence, 0),
    [items]
  );
  const totalValue = useMemo(
    () => items.reduce((s, r) => s + r.total_pence, 0),
    [items]
  );

  if (!sessionChecked) return <div className="p-6">Loading…</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
      {/* ---------- Sidebar ---------- */}
      <aside className="lg:sticky lg:top-4 h-fit">
        <Card>
          <nav className="flex flex-col gap-1">
            <a
              href="/app/home"
              className="text-left rounded-xl px-3 py-2 text-sm font-medium hover:bg-gray-100 text-gray-800"
            >
              Home
            </a>
            {(['jobs', 'upload', 'items'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setRoute(k)}
                className={`text-left rounded-xl px-3 py-2 text-sm font-medium ${
                  route === k
                    ? 'bg-brand-50 text-brand-700'
                    : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                {k[0].toUpperCase() + k.slice(1)}
              </button>
            ))}
          </nav>
        </Card>

        <Card className="mt-4" title="Session" subtitle={mode === 'demo_pin' ? 'Demo (local)' : userEmail}>
          {mode !== 'demo_pin' && (
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/';
              }}
            >
              Sign out
            </Button>
          )}
        </Card>
      </aside>

      {/* ---------- Main area ---------- */}
      <section className="space-y-6">
        {/* Jobs */}
        {route === 'jobs' && (
          <Card
            title="Projects"
            subtitle={`${jobs.length} job(s)`}
            actions={
              <Button variant="outline" onClick={() => setRoute('upload')}>
                New upload
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((j: any) => (
                <Card
                  key={j.id}
                  title={j.address_line1 || '(no address)'}
                  subtitle={`${j.region || '—'} • ${j.postcode || '—'}`}
                  actions={
                    <Button
                      size="sm"
                      onClick={() => {
                        setActiveJobId(j.id);
                        setRoute('items');
                      }}
                    >
                      Open
                    </Button>
                  }
                >
                  <div className="text-sm text-gray-600">
                    Order: {j.order_no || '—'}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Upload */}
        {route === 'upload' && (
          <div className="space-y-4">
            <Card title="Upload Schedule of Works (XLSX)">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </Card>

            <Card title="Property details" subtitle="All fields optional">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  'inspected_by',
                  'address_line1',
                  'address_line2',
                  'town',
                  'postcode',
                  'key_location',
                  'key_safe_code',
                  'order_no',
                  'property_type',
                  'tenure_type',
                  'condition',
                  'uprn',
                  'fund',
                  'client_name',
                ].map((k) => (
                  <Input
                    key={k}
                    value={property[k] || ''}
                    onChange={(v) =>
                      setProperty((p: any) => ({ ...p, [k]: v }))
                    }
                    placeholder={k
                      .replaceAll('_', ' ')
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  />
                ))}

                <Select
                  value={property.region || ''}
                  onChange={(v) =>
                    setProperty((p: any) => ({ ...p, region: v }))
                  }
                >
                  {['Gloucester', 'Hackney', 'Bristol'].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </Select>
              </div>
            </Card>

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setProperty({ region: 'Gloucester' });
                }}
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  if (!file) return alert('Choose a file first');
                  handleUpload(file, property);
                }}
              >
                Create Job
              </Button>
            </div>
          </div>
        )}

        {/* Items */}
        {route === 'items' && (
          <div className="space-y-4">
            <Card
              title="Job overview"
              subtitle={`${activeJob?.address_line1 || '(no address)'} — ${
                activeJob?.region || '—'
              }`}
              actions={
                <>
                  <Badge tone="brand">
                    {Math.round(
                      (items.filter((r) => r.status === 'Completed').length /
                        Math.max(items.length, 1)) *
                        100
                    )}
                    % complete
                  </Badge>
                  <Badge tone="gray">
                    {pounds(fromPence(completeValue))} /{' '}
                    {pounds(fromPence(totalValue))}
                  </Badge>
                  <Button variant="outline" onClick={exportCurrent}>
                    Export
                  </Button>
                </>
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">Order No.</div>
                  <div className="font-medium">{activeJob?.order_no || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-500">UPRN</div>
                  <div className="font-medium">{activeJob?.uprn || '—'}</div>
                </div>
                <div>
                  <div className="text-gray-500">Key Safe</div>
                  <div className="font-medium">
                    {activeJob?.key_safe_code || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Postcode</div>
                  <div className="font-medium">
                    {activeJob?.postcode || '—'}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Line Items" subtitle={`${items.length} rows`}>
              <div className="overflow-auto rounded-xl border border-gray-200">
                <table className="min-w-[960px] w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr className="text-left">
                      {[
                        'Code',
                        'Description',
                        'Base',
                        'Contract',
                        'Unit',
                        'Qty',
                        'Total',
                        'Location',
                        'Comments',
                        'Category',
                        'Assignee',
                        'Status',
                        'Evidence',
                      ].map((h) => (
                        <th key={h} className="px-3 py-2 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row: any) => (
                      <tr key={row.id} className="border-t">
                        <td className="px-3 py-2 font-medium text-gray-900">
                          {row.code}
                        </td>
                        <td className="px-3 py-2 max-w-[380px]">
                          <div className="truncate" title={row.description}>
                            {row.description}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          {pounds(fromPence(row.base_rate_pence))}
                        </td>
                        <td className="px-3 py-2">
                          {pounds(fromPence(row.contract_rate_pence))}
                        </td>
                        <td className="px-3 py-2">{row.unit}</td>
                        <td className="px-3 py-2">{row.qty}</td>
                        <td className="px-3 py-2 font-medium">
                          {pounds(fromPence(row.total_pence))}
                        </td>
                        <td className="px-3 py-2">{row.location}</td>
                        <td
                          className="px-3 py-2 max-w-[260px] truncate"
                          title={row.comments}
                        >
                          {row.comments || '—'}
                        </td>
                        <td className="px-3 py-2">
                          <Select
                            value={row.category}
                            onChange={(v) => updateItem(row.id, { category: v })}
                          >
                            {seedCategories.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </Select>
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            value={row.assignee_name || ''}
                            onChange={(v) =>
                              updateItem(row.id, { assignee_name: v })
                            }
                            placeholder="Contractor name"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Select
                            value={row.status}
                            onChange={(v) => updateItem(row.id, { status: v })}
                          >
                            {[
                              'Unassigned',
                              'Assigned',
                              'Started',
                              'Completed',
                            ].map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </Select>
                          <div className="mt-1">
                            <Badge tone={statusTone(row.status)}>
                              {row.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) addEvidence(row.id, f);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}
