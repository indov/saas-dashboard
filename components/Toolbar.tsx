'use client';

type Props = {
  query: string;
  setQuery: (v: string) => void;
  statusFilter: 'all' | 'active' | 'on hold' | 'completed';
  setStatusFilter: (v: 'all' | 'active' | 'on hold' | 'completed') => void;
  budgetSort: 'none' | 'asc' | 'desc';
  setBudgetSort: (v: 'none' | 'asc' | 'desc') => void;
  onAdd: () => void;
};

export default function Toolbar({
  query, setQuery,
  statusFilter, setStatusFilter,
  budgetSort, setBudgetSort,
  onAdd
}: Props) {
  return (
    <div className="inline-flex gap-x-2">
      <input
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        placeholder="Search name or member…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <select
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as any)}
      >
        <option value="all">All statuses</option>
        <option value="active">active</option>
        <option value="on hold">on hold</option>
        <option value="completed">completed</option>
      </select>
      <select
        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-neutral-700 text-sm bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        value={budgetSort}
        onChange={(e) => setBudgetSort(e.target.value as any)}
      >
        <option value="none">Sort: Budget —</option>
        <option value="asc">Sort: Budget ↑</option>
        <option value="desc">Sort: Budget ↓</option>
      </select>
      <button
        type="button"
        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        onClick={onAdd}
      >
        <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="M12 5v14" />
        </svg>
        Add
      </button>
    </div>
  );
}