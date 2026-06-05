import { useEffect, useState } from "react";
import { 
  BarChart3, 
  Eye, 
  MousePointerClick, 
  Clock, 
  Globe, 
  Smartphone, 
  Laptop, 
  Tablet as TabletIcon, 
  RefreshCw 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

interface AnalyticsSummary {
  totalVisits: number;
  totalClicks: number;
  avgDuration: number;
}

interface TopPath {
  _id: string;
  count: number;
}

interface DeviceStat {
  _id: string;
  count: number;
}

interface CountryStat {
  _id: string;
  code: string;
  count: number;
}

interface DailyTrend {
  date: string;
  visits: number;
  clicks: number;
}

interface RecentLog {
  _id: string;
  event_type: string;
  event_label: string;
  path: string;
  device_type: string;
  geo: {
    city: string;
    country: string;
  };
  created_at: string;
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  topPaths: TopPath[];
  devices: DeviceStat[];
  countries: CountryStat[];
  dailyVisits: DailyTrend[];
  recentEvents: RecentLog[];
}

const COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const token = localStorage.getItem("sb-token");
      const res = await fetch("/api/analytics", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const json = await res.ok ? await res.json() : null;
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getDeviceIcon = (device: string) => {
    switch (device?.toLowerCase()) {
      case "mobile":
        return <Smartphone size={16} className="text-neon-cyan" />;
      case "tablet":
        return <TabletIcon size={16} className="text-amber-400" />;
      default:
        return <Laptop size={16} className="text-emerald-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm font-mono">Aggregating visual telemetry data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 border border-border/50 rounded-xl bg-background/50 glass">
        <p className="text-muted-foreground text-sm">Failed to retrieve analytics payload.</p>
        <button 
          onClick={() => fetchAnalytics()} 
          className="mt-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg border border-primary/20 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { summary, topPaths, devices, countries, dailyVisits, recentEvents } = data;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">System Analytics</h1>
          <p className="text-sm text-muted-foreground">Monitor visitor behaviors, paths, and platform interaction telemetry.</p>
        </div>
        <button
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 hover:bg-foreground/5 transition-all text-xs font-mono text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Syncing..." : "Sync Logs"}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border/40 bg-background/30 glass relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Total Page Views</p>
              <h3 className="text-3xl font-bold mt-1 tracking-tight text-foreground">{summary.totalVisits.toLocaleString()}</h3>
            </div>
            <div className="p-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan">
              <Eye size={20} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-cyan to-transparent opacity-50 group-hover:opacity-100 transition-all" />
        </div>

        <div className="p-4 rounded-xl border border-border/40 bg-background/30 glass relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Platform Clicks</p>
              <h3 className="text-3xl font-bold mt-1 tracking-tight text-foreground">{summary.totalClicks.toLocaleString()}</h3>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <MousePointerClick size={20} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-transparent opacity-50 group-hover:opacity-100 transition-all" />
        </div>

        <div className="p-4 rounded-xl border border-border/40 bg-background/30 glass relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Avg Session Time</p>
              <h3 className="text-3xl font-bold mt-1 tracking-tight text-foreground">{formatDuration(summary.avgDuration)}</h3>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Clock size={20} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-400 to-transparent opacity-50 group-hover:opacity-100 transition-all" />
        </div>

        <div className="p-4 rounded-xl border border-border/40 bg-background/30 glass relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Global Visitors</p>
              <h3 className="text-3xl font-bold mt-1 tracking-tight text-foreground">{countries.length} Regions</h3>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Globe size={20} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-transparent opacity-50 group-hover:opacity-100 transition-all" />
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitor Trend Line Chart */}
        <div className="lg:col-span-2 p-5 border border-border/40 rounded-xl bg-background/20 glass flex flex-col h-[320px]">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono mb-4">Traffic Performance Trend</h3>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyVisits}>
                <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px" }} 
                  labelStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Line type="monotone" dataKey="visits" stroke="#06b6d4" strokeWidth={2.5} activeDot={{ r: 6 }} name="Page Views" />
                <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} name="Clicks" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device breakdown Pie Chart */}
        <div className="p-5 border border-border/40 rounded-xl bg-background/20 glass flex flex-col h-[320px]">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono mb-2">Device Segmentation</h3>
          <div className="flex-1 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={devices}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {devices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
              <span className="text-xl font-bold">{summary.totalVisits}</span>
              <span className="text-[10px] text-muted-foreground font-mono uppercase">Sessions</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-xs font-mono">
            {devices.map((dev, idx) => (
              <div key={dev._id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{dev._id || "Other"} ({dev.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Page Path Counts */}
        <div className="p-5 border border-border/40 rounded-xl bg-background/20 glass flex flex-col">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono mb-4">Top Visited Pages</h3>
          <div className="space-y-4 flex-1">
            {topPaths.map((path, idx) => {
              const maxCount = Math.max(...topPaths.map(p => p.count), 1);
              const percentage = (path.count / maxCount) * 100;
              return (
                <div key={path._id} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="truncate max-w-[240px] text-foreground font-medium">{path._id}</span>
                    <span className="text-muted-foreground">{path.count} views</span>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden border border-border/20">
                    <div 
                      className="bg-gradient-to-r from-neon-cyan to-primary h-full rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {topPaths.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-6">No page views recorded yet.</p>
            )}
          </div>
        </div>

        {/* Global Regions bar chart */}
        <div className="p-5 border border-border/40 rounded-xl bg-background/20 glass flex flex-col h-[280px]">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono mb-4">Geographical Distribution</h3>
          <div className="flex-1 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countries} layout="vertical">
                <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="_id" type="category" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px" }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Visitors">
                  {countries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Stream Activity Table */}
      <div className="border border-border/40 rounded-xl bg-background/20 glass overflow-hidden">
        <div className="px-5 py-4 border-b border-border/40 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground font-mono">Live Activity Stream</h3>
            <p className="text-[10px] text-muted-foreground font-mono">Real-time interaction and navigation event records</p>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[350px] custom-scrollbar">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-muted/30 sticky top-0 border-b border-border/40 text-muted-foreground text-[10px] uppercase">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Event</th>
                <th className="p-3">Path</th>
                <th className="p-3">Location</th>
                <th className="p-3">Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {recentEvents.map((e) => (
                <tr key={e._id} className="hover:bg-foreground/[0.02] transition-colors">
                  <td className="p-3 text-muted-foreground whitespace-nowrap">
                    {new Date(e.created_at).toLocaleTimeString()}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] ${
                      e.event_type === "page_view" 
                        ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20" 
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>
                      {e.event_type}
                    </span>
                  </td>
                  <td className="p-3 truncate max-w-[200px]" title={e.path}>
                    {e.path || "/"}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {e.geo ? `${e.geo.city}, ${e.geo.country}` : "Unknown"}
                  </td>
                  <td className="p-3 flex items-center gap-1.5">
                    {getDeviceIcon(e.device_type)}
                    <span className="text-[10px] text-muted-foreground capitalize">{e.device_type}</span>
                  </td>
                </tr>
              ))}
              {recentEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No records in stream history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
