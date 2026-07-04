import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, UserPlus, Settings, LogOut, Sparkles, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/leads/new", label: "Add Lead", icon: UserPlus },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center gap-2 px-5 border-b border-sidebar-border">
          <div className="size-8 rounded-lg grid place-items-center" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="size-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-sm">Customer Connect</div>
            <div className="text-[11px] text-sidebar-foreground/60">Hub CRM</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active =
              item.to === "/leads"
                ? pathname === "/leads" || (pathname.startsWith("/leads/") && pathname !== "/leads/new")
                : pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card/60 backdrop-blur sticky top-0 z-20 flex items-center px-4 lg:px-6 gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
          <div className="font-semibold text-sm text-muted-foreground">
            {nav.find((n) => pathname === n.to)?.label ??
              (pathname.startsWith("/leads/") ? "Lead details" : "Workspace")}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
