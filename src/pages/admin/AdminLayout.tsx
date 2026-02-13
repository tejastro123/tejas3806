import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { syncReposToSupabase } from "@/lib/githubSync";
import {
  User, FileText, Briefcase, FolderGit2, Wrench, Zap,
  PenTool, MessageSquare, LogOut, Github, Menu, X, Home,
  LayoutDashboard, Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/hero", icon: User, label: "Hero / Personal" },
  { to: "/admin/about", icon: FileText, label: "About Me" },
  { to: "/admin/experience", icon: Briefcase, label: "Experience" },
  { to: "/admin/projects", icon: FolderGit2, label: "Projects" },
  { to: "/admin/skills", icon: Wrench, label: "Skills" },
  { to: "/admin/services", icon: Zap, label: "Services" },
  { to: "/admin/blog", icon: PenTool, label: "Blog" },
  { to: "/admin/testimonials", icon: MessageSquare, label: "Testimonials" },
  { to: "/admin/messages", icon: Inbox, label: "Messages" },
];


const AdminLayout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const handleGitHubSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    try {
      const count = await syncReposToSupabase();
      setSyncMsg(`✅ Synced ${count} repos from GitHub!`);
    } catch (err: any) {
      setSyncMsg(`❌ Error: ${err.message}`);
    }
    setSyncing(false);
    setTimeout(() => setSyncMsg(""), 5000);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 h-screen bg-background border-r border-border flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-lg gradient-text">Admin Panel</h2>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs"
            onClick={handleGitHubSync}
            disabled={syncing}
          >
            <Github size={14} />
            {syncing ? "Syncing..." : "Sync from GitHub"}
          </Button>

          <a href="/" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="w-full gap-2 text-xs">
              <Home size={14} /> View Portfolio
            </Button>
          </a>

          <Button
            variant="ghost"
            size="sm"
            className="w-full gap-2 text-xs text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut size={14} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1">
            {syncMsg && (
              <span className="text-sm font-medium">{syncMsg}</span>
            )}
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            {user?.email}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
