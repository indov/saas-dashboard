'use client';

import type { Project } from '@/types/project';

type Form = {
  name: string;
  status: Project['status'];
  deadline: string | null;
  assigned_member: string | null;
  budget: number | null;
};

type Props = {
  open: boolean;
  editingId: string | null;
  form: Form;
  setForm: (f: Form) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
};

export default function ProjectModal({
  open, editingId, form, setForm, onClose, onSave, onDelete
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 dark:text-neutral-100">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit project' : 'Add project'}</h3>
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Name</span>
            <input
              className="rounded-lg border border-gray-300 p-2 dark:border-neutral-700 dark:bg-neutral-800"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Project name"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Status</span>
            <select
              className="rounded-lg border border-gray-300 p-2 dark:border-neutral-700 dark:bg-neutral-800"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Project['status'] })}
            >
              <option value="active">Active</option>
              <option value="on hold">On hold</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Deadline</span>
            <input
              type="date"
              className="rounded-lg border border-gray-300 p-2 dark:border-neutral-700 dark:bg-neutral-800"
              value={form.deadline ?? ''}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Assigned member</span>
            <input
              className="rounded-lg border border-gray-300 p-2 dark:border-neutral-700 dark:bg-neutral-800"
              value={form.assigned_member ?? ''}
              onChange={(e) => setForm({ ...form, assigned_member: e.target.value })}
              placeholder="e.g. Ana Petrovska"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Budget</span>
            <input
              type="number"
              className="rounded-lg border border-gray-300 p-2 dark:border-neutral-700 dark:bg-neutral-800"
              value={form.budget ?? ''}
              onChange={(e) =>
                setForm({ ...form, budget: e.target.value === '' ? null : Number(e.target.value) })
              }
              placeholder="e.g. 10000"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between">
          {editingId ? (
            <button
              type="button"
              className="rounded-lg border px-4 py-2 text-red-600 border-red-300 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
              onClick={onDelete}
            >
              Delete
            </button>
          ) : <span />}

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border px-4 py-2 dark:border-neutral-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              onClick={onSave}
            >
              {editingId ? 'Save changes' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}