'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from 'utils/supabase/client';
import type { Project } from 'components/Project';
import Toolbar from 'components/Toolbar';
import ProjectTable from 'components/ProjectTable';
import ProjectModal from 'components/ProjectModal';

export default function Home() {
  const supabase = createClient();
  const [rows, setRows] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'on hold' | 'completed'>('all');
  const [budgetSort, setBudgetSort] = useState<'none' | 'asc' | 'desc'>('none');

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    status: Project['status'];
    deadline: string | null;
    assigned_member: string | null;
    budget: number | null;
  }>({
    name: '',
    status: 'active',
    deadline: '',
    assigned_member: '',
    budget: null,
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchRows = async () => {
    setLoading(true);
    setErr(null);
    const { data, error } = await supabase
      .from('projects')
      .select('id,name,status,deadline,assigned_member,budget')
      .order('deadline', { ascending: true });

    if (error) setErr(error.message);
    setRows((data as Project[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const saveProject = async () => {
    if (!form.name.trim()) {
      alert('Name is required');
      return;
    }

    const payload = {
      name: form.name.trim(),
      status: form.status,
      deadline: form.deadline || null,
      assigned_member: form.assigned_member || null,
      budget:
        form.budget === null || form.budget === (undefined as any)
          ? null
          : Number(form.budget),
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('projects').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('projects').insert(payload));
    }

    if (error) {
      alert(error.message);
      return;
    }

    setOpen(false);
    setEditingId(null);
    setForm({ name: '', status: 'active', deadline: '', assigned_member: '', budget: null });

    fetchRows();
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      status: p.status,
      deadline: p.deadline ?? '',
      assigned_member: p.assigned_member ?? '',
      budget: p.budget ?? null,
    });
    setOpen(true);
  };

  const removeProject = async () => {
    if (!editingId) return;
    const ok = confirm('Delete this project? This cannot be undone.');
    if (!ok) return;
    const { error } = await supabase.from('projects').delete().eq('id', editingId);
    if (error) {
      alert(error.message);
      return;
    }
    setOpen(false);
    setEditingId(null);
    fetchRows();
  };


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.assigned_member ?? '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' ? true : r.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [rows, query, statusFilter]);

  const sorted = useMemo(() => {
    const base = [...filtered];
    if (budgetSort === 'none') return base;

    const norm = (v: number | null | undefined) =>
      v === null || v === undefined ? Number.POSITIVE_INFINITY : Number(v);

    base.sort((a, b) => {
      const av = norm(a.budget);
      const bv = norm(b.budget);
      return budgetSort === 'asc' ? av - bv : bv - av;
    });
    return base;
  }, [filtered, budgetSort]);

  const stats = useMemo(() => {
    const totalBudget = rows.reduce((sum, r) => sum + (r.budget == null ? 0 : Number(r.budget)), 0);
    const totalCount = rows.length;
    const completedCount = rows.filter((r) => r.status === 'completed').length;
    const completedPct = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

    let farthestName: string | null = null;
    let farthestDate: Date | null = null;
    for (const r of rows) {
      if (!r.deadline) continue;
      const d = new Date(r.deadline);
      if (!farthestDate || d > farthestDate) {
        farthestDate = d;
        farthestName = r.name;
      }
    }

    return { totalBudget, totalCount, completedCount, completedPct, farthestName, farthestDate };
  }, [rows]);

  return (
    <main>

      {err && (
        <div>
          {err}
        </div>
      )}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                      Projects Dashboard
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400">

                    </p>
                  </div>

                  <Toolbar
                    query={query}
                    setQuery={setQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={(v) => setStatusFilter(v)}
                    budgetSort={budgetSort}
                    setBudgetSort={(v) => setBudgetSort(v)}
                    onAdd={() => { setEditingId(null); setOpen(true); }}
                  />
                </div>
                <ProjectTable rows={sorted} loading={loading} onEdit={startEdit} />

                <div className="px-6 py-6 border-t border-gray-200 dark:border-neutral-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                    <div className="h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="p-4 md:p-5">
                        <p className="text-xs uppercase text-gray-500 dark:text-neutral-500">Total Budget</p>
                        <h3 className="mt-1 text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                          {Intl.NumberFormat().format(stats.totalBudget)}
                        </h3>
                      </div>
                    </div>

                    <div className="h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="p-4 md:p-5">
                        <p className="text-xs uppercase text-gray-500 dark:text-neutral-500">Completed Projects</p>
                        <h3 className="mt-1 text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                          {stats.totalCount === 0 ? '0%' : `${stats.completedPct.toFixed(1)}%`}
                        </h3>
                      </div>
                    </div>

                    <div className="h-full flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="p-4 md:p-5">
                        <p className="text-xs uppercase text-gray-500 dark:text-neutral-500">Farthest Deadline</p>
                        <div className="mt-1">
                          <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                            {stats.farthestDate ? new Date(stats.farthestDate).toLocaleDateString() : '—'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-neutral-400 truncate">
                            {stats.farthestName ?? ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProjectModal
        open={open}
        editingId={editingId}
        form={form}
        setForm={setForm}
        onClose={() => setOpen(false)}
        onSave={saveProject}
        onDelete={removeProject}
      />
    </main>
  );
}