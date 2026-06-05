import { useState, useEffect } from "react";
import { Activity, ShieldAlert, CheckCircle2, RefreshCw, Cpu, Database, Server, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

interface ServiceReport {
  status: "up" | "down";
  latency: number;
  service: string;
  timestamp: string;
  database?: string;
  uptime?: number;
  requests?: {
    total: number;
    errors: number;
  };
  system?: {
    cpu: { user: number; system: number };
    memory: { heapUsed: number; heapTotal: number; rss: number };
  };
  error?: string;
}

interface ObservabilityReport {
  gateway: string;
  timestamp: string;
  services: Record<string, ServiceReport>;
}

const formatUptime = (seconds?: number): string => {
  if (seconds === undefined) return "N/A";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
};

export default function AdminObservability() {
  const [data, setData] = useState<ObservabilityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/observability/status");
      if (res.ok) {
        const payload = await res.json();
        setData(payload);
      }
    } catch (err) {
      console.error("Failed to load observability status:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 5000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="h-8 w-8 animate-spin text-neon-cyan" />
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Establishing telemetry links...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">System Observability</h2>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-1">
            Real-time microservice status, diagnostics, & telemetry mesh
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchStatus} 
          disabled={refreshing}
          className="gap-2 neon-border hover:bg-muted"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-neon-cyan" : ""}`} />
          Refresh Nodes
        </Button>
      </div>

      {/* Gateway Overview */}
      <Card className="glass border-border/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-2 h-full bg-neon-cyan" />
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-neon-cyan/10 rounded-xl">
              <Server className="h-6 w-6 text-neon-cyan" />
            </div>
            <div>
              <div className="font-bold text-lg">API Gateway Proxy Hub</div>
              <div className="text-xs font-mono text-muted-foreground">Uptime: {formatUptime(process.uptime())}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-muted-foreground">Port</div>
              <div className="font-bold text-sm">5000</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Downstream Microservices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && Object.entries(data.services).map(([name, service]) => {
          const isUp = service.status === "up";
          const mem = service.system?.memory;

          return (
            <Card key={name} className="glass border-border/50 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/5">
              <div className={`absolute top-0 left-0 w-full h-[3px] ${isUp ? "bg-emerald-500" : "bg-destructive"}`} />
              
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold font-mono capitalize tracking-wider">
                  {name}-service
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{service.latency}ms</span>
                  {isUp ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 text-destructive animate-pulse" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 pt-2">
                {/* Status bar */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground uppercase tracking-wider">Node Status</span>
                  <span className={`font-bold uppercase font-mono ${isUp ? "text-emerald-400" : "text-destructive"}`}>
                    {isUp ? "Online" : "Offline"}
                  </span>
                </div>

                {isUp ? (
                  <>
                    {/* Database status */}
                    {service.database && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Database className="h-3.5 w-3.5" /> Database
                        </span>
                        <span className="font-mono text-xs uppercase text-emerald-400">
                          {service.database}
                        </span>
                      </div>
                    )}

                    {/* Uptime */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> Uptime
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatUptime(service.uptime)}
                      </span>
                    </div>

                    {/* Requests info */}
                    {service.requests && (
                      <div className="flex items-center justify-between text-xs border-t border-border/30 pt-2">
                        <span className="text-muted-foreground">Total / Failed Requests</span>
                        <span className="font-mono text-xs">
                          {service.requests.total} / <span className={service.requests.errors > 0 ? "text-destructive" : ""}>{service.requests.errors}</span>
                        </span>
                      </div>
                    )}

                    {/* System specs */}
                    {mem && (
                      <div className="space-y-1.5 pt-2 border-t border-border/30">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Cpu className="h-3.5 w-3.5" /> Memory Consumption
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
                          <div className="bg-muted/30 rounded p-1 border border-border/20">
                            <div className="text-muted-foreground">Heap Used</div>
                            <div className="font-bold text-foreground">{mem.heapUsed}MB</div>
                          </div>
                          <div className="bg-muted/30 rounded p-1 border border-border/20">
                            <div className="text-muted-foreground">Heap Total</div>
                            <div className="font-bold text-foreground">{mem.heapTotal}MB</div>
                          </div>
                          <div className="bg-muted/30 rounded p-1 border border-border/20">
                            <div className="text-muted-foreground">RSS</div>
                            <div className="font-bold text-foreground">{mem.rss}MB</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-destructive bg-destructive/5 rounded border border-destructive/10 p-2.5 font-mono">
                    Node Error: {service.error || "Connection timed out"}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
