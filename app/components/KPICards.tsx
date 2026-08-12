interface KPICardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: "accent" | "success" | "warning" | "danger";
}

function KPICard({ label, value, icon, color = "accent" }: KPICardProps) {
  const colorClasses = {
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  }[color];

  return (
    <div className="bg-surface-1 border border-border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-tertiary uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
        </div>
        <div className={`text-2xl ${colorClasses} p-2 rounded`}>{icon}</div>
      </div>
    </div>
  );
}

interface KPIGridProps {
  entities: number;
  customers: number;
  upcomingEvents: number;
  recentReports: number;
}

export function KPIGrid({ entities, customers, upcomingEvents, recentReports }: KPIGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <KPICard label="Entidades" value={entities} icon="🏢" color="accent" />
      <KPICard label="Clientes" value={customers} icon="👥" color="success" />
      <KPICard label="Eventos Próximos" value={upcomingEvents} icon="📅" color="warning" />
      <KPICard label="Informes" value={recentReports} icon="📊" color="accent" />
    </div>
  );
}
