import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowUpDown, MoreHorizontal, Search, UserPlus, Trash2, Eye, ArrowUpRight,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  SOURCE_LABEL, SOURCE_OPTIONS, STATUS_LABEL, STATUS_OPTIONS, statusBadgeClass,
  type LeadSource, type LeadStatus,
} from "@/lib/lead-utils";

export const Route = createFileRoute("/_authenticated/leads")({
  component: LeadsLayout,
});

function LeadsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // /leads → list; /leads/new or /leads/:id → child outlet only
  if (pathname === "/leads") return <LeadsListPage />;
  return <Outlet />;
}

type Lead = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: LeadSource;
  status: LeadStatus;
  follow_up_date: string | null;
  created_at: string;
};

type SortKey = "full_name" | "created_at" | "follow_up_date" | "status";
const PAGE_SIZE = 8;

function LeadsListPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "created_at", dir: "desc" });
  const [page, setPage] = useState(1);

  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (!q) return true;
      return [l.full_name, l.email, l.phone, l.company].some((v) => v?.toLowerCase().includes(q));
    });
    rows = rows.sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [leads, search, statusFilter, sourceFilter, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Lead deleted"); },
    onError: (e: any) => toast.error(e.message),
  });

  const statusMut = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeadStatus }) => {
      const { error } = await supabase.from("leads").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Status updated"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${filtered.length} of ${leads.length} leads`}
          </p>
        </div>
        <Button asChild className="shadow-[var(--shadow-elegant)]">
          <Link to="/leads/new"><UserPlus className="size-4" /> Add lead</Link>
        </Button>
      </div>

      <Card className="p-4 flex flex-wrap gap-3 items-center shadow-[var(--shadow-card)]">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name, email, phone, company…"
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); setPage(1); }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v as any); setPage(1); }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {SOURCE_OPTIONS.map((s) => <SelectItem key={s} value={s}>{SOURCE_LABEL[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </Card>

      <Card className="shadow-[var(--shadow-card)] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead label="Name" sortKey="full_name" sort={sort} onToggle={toggleSort} />
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Source</TableHead>
              <SortableHead label="Status" sortKey="status" sort={sort} onToggle={toggleSort} />
              <SortableHead label="Follow-up" sortKey="follow_up_date" sort={sort} onToggle={toggleSort} className="hidden lg:table-cell" />
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}><TableCell colSpan={7}><div className="h-8 bg-muted/60 rounded animate-pulse" /></TableCell></TableRow>
            ))}
            {error && (
              <TableRow><TableCell colSpan={7} className="text-center text-destructive py-8">{(error as Error).message}</TableCell></TableRow>
            )}
            {!isLoading && paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="text-sm text-muted-foreground">No leads found.</div>
                  <Button asChild variant="link"><Link to="/leads/new">Add your first lead</Link></Button>
                </TableCell>
              </TableRow>
            )}
            {paged.map((l) => (
              <TableRow key={l.id} className="group">
                <TableCell>
                  <Link to="/leads/$id" params={{ id: l.id }} className="font-medium hover:text-primary inline-flex items-center gap-1">
                    {l.full_name}
                  </Link>
                  {l.company && <div className="text-xs text-muted-foreground">{l.company}</div>}
                </TableCell>
                <TableCell className="text-sm">{l.email}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{l.phone ?? "—"}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{SOURCE_LABEL[l.source]}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusBadgeClass(l.status)}>{STATUS_LABEL[l.status]}</Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                  {l.follow_up_date ? format(new Date(l.follow_up_date), "MMM d, yyyy") : "—"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon"><MoreHorizontal className="size-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild><Link to="/leads/$id" params={{ id: l.id }}><Eye className="size-4" /> View</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs">Set status</DropdownMenuLabel>
                      {STATUS_OPTIONS.map((s) => (
                        <DropdownMenuItem key={s} onClick={() => statusMut.mutate({ id: l.id, status: s })}>
                          <ArrowUpRight className="size-4" /> {STATUS_LABEL[s]}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="size-4" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                            <AlertDialogDescription>This will permanently remove {l.full_name} and all related notes.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteMut.mutate(l.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Page {safePage} of {pageCount}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={safePage === pageCount} onClick={() => setPage(safePage + 1)}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SortableHead({
  label, sortKey, sort, onToggle, className,
}: { label: string; sortKey: SortKey; sort: { key: SortKey; dir: "asc"|"desc" }; onToggle: (k: SortKey) => void; className?: string }) {
  const active = sort.key === sortKey;
  return (
    <TableHead className={className}>
      <button onClick={() => onToggle(sortKey)} className={`inline-flex items-center gap-1 hover:text-foreground ${active ? "text-foreground" : ""}`}>
        {label} <ArrowUpDown className="size-3" />
      </button>
    </TableHead>
  );
}
