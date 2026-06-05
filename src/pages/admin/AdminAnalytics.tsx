import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { BarChart3, Eye, MousePointerClick, FileDown, Mail, ExternalLink } from "lucide-react";

interface Event {
  id: string;
  event_type: string;
  event_label: string | null;
  path: string | null;
  referrer: string | null;
  session_id: string | null;
  created_at: string;
}

const ICONS: Record<string, any> = {
  page_view: Eye,
  project_click: MousePointerClick,
  resume_download: FileDown,
  contact_submit: Mail,
  blog_click: ExternalLink,
  social_click: ExternalLink,
};

const RANGES = [
  { label: "24h", days: 1 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

const AdminAnalytics = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(7);

  useEffect(() => {
    setLoading(true);
    const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString();
    apiClient
      .from("analytics_events")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000)
      .then(({ data }) => {
        setEvents((data as Event[]) ?? []);
        setLoading(false);
      });
  }, [range]);

  const totals: Record<string, number> = {};
  events.forEach((e) => {
    totals[e.event_type] = (totals[e.event_type] ?? 0) + 1;
  });

  const uniqueSessions = new Set(events.map((e) => e.session_id).filter(Boolean)).size;

  const labelCounts: Record<string, Record<string, number>> = {};
  events.forEach((e) => {
    if (!e.event_label) return;
    labelCounts[e.event_type] ??= {};
    labelCounts[e.event_type][e.event_label] =
      (labelCounts[e.event_type][e.event_label] ?? 0) + 1;
  });

  const topReferrers: Record<string, number> = {};
  events
    .filter((e) => e.event_type === "page_view" && e.referrer)
    .forEach((e) => {
      try {
        const host = new URL(e.referrer!).hostname;
        topReferrers[host] = (topReferrers[host] ?? 0) + 1;
      } catch {
        /* ignore */
      }
    });

  const top = (obj: Record<string, number>, n = 8) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <BarChart3 className="text-primary" />
          <h1 className="text-2xl font-bold">Analytics</h1>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-muted">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.days)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                range === r.days ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <>
          {/* Headline stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Total events" value={events.length} />
            <Stat label="Unique sessions" value={uniqueSessions} />
            <Stat label="Page views" value={totals.page_view ?? 0} />
            <Stat label="Contact submits" value={totals.contact_submit ?? 0} />
          </div>

          {/* Event type breakdown */}
          <Section title="Events by type">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(totals).map(([type, count]) => {
                const Icon = ICONS[type] ?? BarChart3;
                return (
                  <div
                    key={type}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-background"
                  >
                    <Icon size={18} className="text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{type.replace("_", " ")}</p>
                    </div>
                    <span className="text-lg font-bold">{count}</span>
                  </div>
                );
              })}
              {Object.keys(totals).length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full">
                  No events yet — interact with the site to start collecting data.
                </p>
              )}
            </div>
          </Section>

          {/* Top projects */}
          {labelCounts.project_click && (
            <Section title="Top project clicks">
              <Bars data={top(labelCounts.project_click)} />
            </Section>
          )}

          {/* Top blog */}
          {labelCounts.blog_click && (
            <Section title="Top blog reads">
              <Bars data={top(labelCounts.blog_click)} />
            </Section>
          )}

          {/* Top referrers */}
          {Object.keys(topReferrers).length > 0 && (
            <Section title="Top referrers">
              <Bars data={top(topReferrers)} />
            </Section>
          )}

          {/* Recent events */}
          <Section title="Recent activity">
            <div className="rounded-lg border overflow-hidden">
              <div className="max-h-80 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-medium">Time</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">Label</th>
                      <th className="text-left p-2 font-medium">Path</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.slice(0, 100).map((e) => (
                      <tr key={e.id} className="border-t">
                        <td className="p-2 text-muted-foreground whitespace-nowrap">
                          {new Date(e.created_at).toLocaleString()}
                        </td>
                        <td className="p-2 font-mono text-xs">{e.event_type}</td>
                        <td className="p-2 truncate max-w-[200px]">{e.event_label}</td>
                        <td className="p-2 text-muted-foreground truncate max-w-[200px]">
                          {e.path}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>
        </>
      )}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="p-4 rounded-xl border bg-background">
    <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
    <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2">
    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h2>
    {children}
  </section>
);

const Bars = ({ data }: { data: [string, number][] }) => {
  const max = Math.max(...data.map((d) => d[1]), 1);
  return (
    <div className="space-y-1.5">
      {data.map(([label, count]) => (
        <div key={label} className="flex items-center gap-3 text-sm">
          <span className="w-48 truncate" title={label}>
            {label}
          </span>
          <div className="flex-1 bg-muted rounded h-6 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary/80 rounded"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="w-10 text-right font-mono">{count}</span>
        </div>
      ))}
    </div>
  );
};

export default AdminAnalytics;
