import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserPlus, MessageSquare, CheckCircle2, ArrowUpRight, CalendarClock } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { SOURCE_LABEL, STATUS_LABEL, statusBadgeClass, type LeadSource, type LeadStatus } from "@/lib/lead-utils";
import { Badge } from "@/components/ui/badge";
import { format, isAfter, isBefore, addDays, startOfToday } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

type Lead = {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  status: LeadStatus;
  source: LeadSource;
  follow_up_date: string | null;
  created_at: string;
};

function DashboardPage() {
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, full_name, email, company, status, source, follow_up_date, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  const total = leads.length;
  const newCount = leads.filter((l) => l.status === "new").length;
  const contacted = leads.filter((l) => l.status === "contacted").length;
  const converted = leads.filter((l) => l.status === "converted").length;
  const conversion = total ? Math.round((converted / total) * 100) : 0;

  const pipeline = [
    { name: "New", value: newCount, fill: "var(--color-chart-1)" },
    { name: "Contacted", value: contacted, fill: "var(--color-chart-3)" },
    { name: "Converted", value: converted, fill: "var(--color-chart-2)" },
  ];

  const sourceData = (["website","referral","social","email","phone","other"] as LeadSource[]).map((s, i) => ({
    name: SOURCE_LABEL[s],
    value: leads.filter((l) => l.source === s).length,
    fill: `var(--color-chart-${(i % 5) + 1})`,
  })).filter((d) => d.value > 0);

  const today = startOfToday();
  const upcoming = leads
    .filter((l) => l.follow_up_date && !isBefore(new Date(l.follow_up_date), today) && isBefore(new Date(l.follow_up_date), addDays(today, 14)))
    .sort((a, b) => (a.follow_up_date! < b.follow_up_date! ? -1 : 1))
    .slice(0, 6);

  const recent = leads.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">A live view of your lead pipeline and follow-ups.</p>
        </div>
        <Link
          to="/leads/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 shadow-[var(--shadow-elegant)]"
        >
          <UserPlus className="size-4" /> Add lead
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Leads" value={total} icon={Users} hint={isLoading ? "Loading…" : "All time"} />
        <StatCard label="New" value={newCount} icon={UserPlus} hint="Awaiting first touch" tone="info" />
        <StatCard label="Contacted" value={contacted} icon={MessageSquare} hint="In conversation" tone="warning" />
        <StatCard label="Converted" value={converted} icon={CheckCircle2} hint={`${conversion}% conversion`} tone="success" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Lead pipeline</CardTitle>
            <CardDescription>Distribution across pipeline stages.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipeline} barSize={56}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Lead sources</CardTitle>
            <CardDescription>Where your leads come from.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {sourceData.length === 0 ? (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourceData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {sourceData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent + Upcoming */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent leads</CardTitle>
              <CardDescription>Latest entries from your team.</CardDescription>
            </div>
            <Link to="/leads" className="text-xs text-primary inline-flex items-center gap-1">
              View all <ArrowUpRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="divide-y">
            {recent.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No leads yet.</p>}
            {recent.map((l) => (
              <Link key={l.id} to="/leads/$id" params={{ id: l.id }} className="flex items-center justify-between py-3 hover:bg-muted/40 -mx-2 px-2 rounded-md">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{l.full_name}</div>
                  <div className="text-xs text-muted-foreground truncate">{l.company ?? l.email}</div>
                </div>
                <Badge variant="secondary" className={statusBadgeClass(l.status)}>
                  {STATUS_LABEL[l.status]}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock className="size-4 text-primary" /> Upcoming follow-ups</CardTitle>
            <CardDescription>Next 14 days.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {upcoming.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">Nothing scheduled.</p>}
            {upcoming.map((l) => {
              const d = new Date(l.follow_up_date!);
              const overdueSoon = isBefore(d, addDays(today, 2));
              return (
                <Link key={l.id} to="/leads/$id" params={{ id: l.id }} className="flex items-center justify-between py-3 hover:bg-muted/40 -mx-2 px-2 rounded-md">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{l.full_name}</div>
                    <div className="text-xs text-muted-foreground truncate">{l.company ?? l.email}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md ${overdueSoon ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"}`}>
                    {format(d, "MMM d")}
                  </span>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label, value, icon: Icon, hint, tone,
}: { label: string; value: number; icon: any; hint?: string; tone?: "info" | "warning" | "success" }) {
  const toneClass =
    tone === "success" ? "text-success bg-success/10" :
    tone === "warning" ? "text-warning bg-warning/10" :
    tone === "info" ? "text-primary bg-primary/10" :
    "text-foreground bg-muted";
  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">{label}</div>
            <div className="text-3xl font-semibold mt-1">{value}</div>
            {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
          </div>
          <div className={`size-10 rounded-lg grid place-items-center ${toneClass}`}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
