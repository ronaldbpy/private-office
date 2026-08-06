"use client";

import { formatDatePY } from "@/lib/dueDates";

export interface TimelineItem {
  id: string;
  eventType: string;
  description: string;
  changedBy: string;
  createdAt: Date;
  entityName?: string;
  entityColorToken?: string | null;
}

function EventIcon({ eventType }: { eventType: string }) {
  const icons: Record<string, string> = {
    entity_created: "🏢",
    entity_ownership_set: "👤",
    account_created: "🏦",
    account_balance_imported: "💰",
    document_uploaded: "📄",
    project_created: "📋",
    project_completed: "✅",
    task_created: "✏️",
    task_updated: "🔄",
    task_completed: "✓",
    obligation_confirmed: "📌",
    obligation_alert: "⚠️",
  };
  return <span>{icons[eventType] || "📌"}</span>;
}

export function TimelineSection({ events }: { events: TimelineItem[] }) {
  if (events.length === 0) {
    return (
      <p className="px-5 py-4 text-sm text-text-secondary">
        Sin eventos registrados aún.
      </p>
    );
  }

  return (
    <>
      {events.map((event, idx) => (
        <div
          key={event.id}
          className="flex gap-4 px-5 py-4 text-sm"
        >
          {/* Timeline marker */}
          <div className="flex flex-col items-center gap-1">
            <div className="rounded-full bg-accent p-2 text-white">
              <EventIcon eventType={event.eventType} />
            </div>
            {idx < events.length - 1 && (
              <div className="h-8 w-0.5 bg-border-soft" />
            )}
          </div>

          {/* Event content */}
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-text-primary">{event.description}</p>
            <p className="mt-0.5 text-xs text-text-tertiary">
              {formatDatePY(event.createdAt)}
              {event.entityName && ` · ${event.entityName}`}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
