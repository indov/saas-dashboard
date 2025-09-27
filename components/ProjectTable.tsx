'use client';

import type { Project } from '@/components/Project';
import StatusBadge from '@/components/StatusBadge';

type Props = {
  rows: Project[];
  loading: boolean;
  onEdit: (p: Project) => void;
};

export default function ProjectTable({ rows, loading, onEdit }: Props) {
  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
      <thead className="bg-gray-50 dark:bg-neutral-900">
        <tr>
          {['Name','Status','Deadline','Assigned','Budget'].map((h) => (
            <th key={h} scope="col" className="px-6 py-3 text-start">
              <div className="flex items-center gap-x-2">
                <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">{h}</span>
              </div>
            </th>
          ))}
          <th scope="col" className="px-6 py-3 text-end"></th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
        {loading ? (
          <tr><td colSpan={6} className="px-6 py-3">Loading…</td></tr>
        ) : rows.length === 0 ? (
          <tr><td colSpan={6} className="px-6 py-3">No projects yet.</td></tr>
        ) : (
          rows.map((p) => (
            <tr className="size-px whitespace-nowrap" key={p.id}>
              <td className="size-px whitespace-nowrap"><div className="px-6 py-3">
                <span className="text-sm text-gray-600 dark:text-neutral-400">{p.name}</span>
              </div></td>
              <td className="size-px whitespace-nowrap"><div className="px-6 py-3">
                <StatusBadge status={p.status} />
              </div></td>
              <td className="size-px whitespace-nowrap"><div className="px-6 py-3">
                <span className="text-sm text-gray-600 dark:text-neutral-400">
                  {p.deadline ? new Date(p.deadline).toLocaleDateString('mk-MK') : '—'}
                </span>
              </div></td>
              <td className="size-px whitespace-nowrap"><div className="px-6 py-3">
                <span className="text-sm text-gray-600 dark:text-neutral-400">{p.assigned_member ?? '—'}</span>
              </div></td>
              <td className="size-px whitespace-nowrap"><div className="px-6 py-3">
                <span className="text-sm text-gray-600 dark:text-neutral-400">
                  {p.budget == null
                    ? '—'
                    : Intl.NumberFormat('mk-MK', { style: 'currency', currency: 'MKD' }).format(Number(p.budget))}
                </span>
              </div></td>
              <td className="size-px whitespace-nowrap">
                <div className="px-6 py-1.5">
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
                    onClick={() => onEdit(p)}
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}