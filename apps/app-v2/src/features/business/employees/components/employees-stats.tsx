import type { EmployeeStats } from '../../../../services/employees/types';

interface EmployeesStatsProps {
  stats: EmployeeStats;
  isLoading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-default-200 bg-content1 p-4">
      <p className="text-xs uppercase tracking-wide text-default-500">
        {label}
      </p>
      <p className="pt-2 text-3xl font-semibold [font-variant-numeric:tabular-nums]">
        {value}
      </p>
    </article>
  );
}

export function EmployeesStats({ stats, isLoading }: EmployeesStatsProps) {
  if (isLoading) {
    return (
      <section
        aria-label="Statystyki pracowników"
        className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard label="Razem" value={0} />
        <StatCard label="Aktywni" value={0} />
        <StatCard label="Nieaktywni" value={0} />
        <StatCard label="Dodani w 30 dni" value={0} />
      </section>
    );
  }

  return (
    <section
      aria-label="Statystyki pracowników"
      className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
    >
      <StatCard label="Razem" value={stats.total} />
      <StatCard label="Aktywni" value={stats.active} />
      <StatCard label="Nieaktywni" value={stats.inactive} />
      <StatCard label="Dodani w 30 dni" value={stats.recentlyAdded} />
    </section>
  );
}
