import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowUpDown,
  BarChart3,
  Brain,
  ChevronRight,
  Code2,
  Divide,
  LayoutDashboard,
  MapPin,
  Network,
  Settings,
  Truck,
} from "lucide-react";
import type { ReactNode } from "react";

interface NavItem {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  module?: string;
}

const navItems: NavItem[] = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  {
    path: "/sorting",
    label: "Delivery Sorting",
    icon: ArrowUpDown,
    module: "Module 1",
  },
  {
    path: "/routes",
    label: "Route Optimization",
    icon: MapPin,
    module: "Module 2",
  },
  {
    path: "/vehicles",
    label: "Vehicle Assignment",
    icon: Truck,
    module: "Module 3",
  },
  {
    path: "/dp",
    label: "Dynamic Programming",
    icon: Brain,
    module: "Module 4",
  },
  {
    path: "/divide-conquer",
    label: "Divide & Conquer",
    icon: Divide,
    module: "Module 5",
  },
  { path: "/performance", label: "Performance", icon: BarChart3 },
  { path: "/code", label: "Code Showcase", icon: Code2 },
];

function SidebarLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      to={item.path}
      data-ocid={`nav.${item.label
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")}.link`}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-md transition-smooth relative",
        isActive
          ? "bg-primary/15 text-primary neon-cyan-border"
          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full shadow-neon-cyan-sm animate-pulse-neon" />
      )}
      <item.icon
        className={cn(
          "w-4 h-4 flex-shrink-0 transition-smooth",
          isActive ? "text-primary" : "group-hover:text-foreground",
        )}
      />
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm font-medium truncate",
            isActive && "font-semibold",
          )}
        >
          {item.label}
        </div>
        {item.module && (
          <div className="text-[10px] font-mono text-muted-foreground/60">
            {item.module}
          </div>
        )}
      </div>
      {isActive && <ChevronRight className="w-3 h-3 text-primary/60" />}
    </Link>
  );
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-primary/15 neon-cyan-border flex items-center justify-center shadow-neon-cyan-sm">
            <Network className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-tight text-foreground">
              LogiOptimize
            </h1>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              v2.0 Engine
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 px-3 pb-2">
            System Modules
          </div>
          {navItems.map((item) => (
            <SidebarLink
              key={item.path}
              item={item}
              isActive={
                item.path === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.path)
              }
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-smooth cursor-pointer">
            <Settings className="w-4 h-4" />
            <span className="text-xs">Settings</span>
          </div>
          <p className="text-[10px] text-muted-foreground/40 text-center mt-3 font-mono">
            © {new Date().getFullYear()} · Built with{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-card border-b border-border/50 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Network className="w-3.5 h-3.5 text-primary/60" />
            <span className="font-mono text-xs">
              {navItems.find((n) =>
                n.path === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(n.path),
              )?.label ?? "LogiOptimize"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.62_0.20_145)] animate-pulse-neon" />
              System Online
            </div>
            <div className="h-4 w-px bg-border/50" />
            <div className="text-xs font-mono text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">{children}</div>
      </main>
    </div>
  );
}
