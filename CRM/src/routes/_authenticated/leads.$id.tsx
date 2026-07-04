import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { LeadForm } from "@/components/lead-form";
import { STATUS_LABEL, SOURCE_LABEL, statusBadgeClass, type LeadStatus, type LeadSource } from "@/lib/lead-utils";
import { ArrowLeft, Mail, Phone, Building2, CalendarClock, Trash2, Pencil, Check, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/leads/$id")({
  component: LeadDetailPage,
});

type Lead = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: LeadSource;
  status: LeadStatus;
  notes: string | null;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
};

type Note = {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

function LeadDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteContent, setEditingNoteContent] = useState("");

  const leadQ = useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Lead;
    },
  });
  const notesQ = useQuery({
    queryKey: ["lead-notes", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false });
      if (error) throw error;
      return data as Note[];
    },
  });

  const addNote = useMutation({
    mutationFn: async (content: string) => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("lead_notes").insert({ lead_id: id, content, created_by: u.user?.id ?? null });
      if (error) throw error;
    },
    onSuccess: () => { setNoteInput(""); qc.invalidateQueries({ queryKey: ["lead-notes", id] }); toast.success("Note added"); },
    onError: (e: any) => toast.error(e.message),
  });
  const updateNote = useMutation({
    mutationFn: async ({ noteId, content }: { noteId: string; content: string }) => {
      const { error } = await supabase.from("lead_notes").update({ content }).eq("id", noteId);
      if (error) throw error;
    },
    onSuccess: () => { setEditingNoteId(null); qc.invalidateQueries({ queryKey: ["lead-notes", id] }); toast.success("Note updated"); },
    onError: (e: any) => toast.error(e.message),
  });
  const deleteNote = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from("lead_notes").delete().eq("id", noteId);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["lead-notes", id] }); toast.success("Note deleted"); },
  });
  const deleteLead = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); toast.success("Lead deleted"); navigate({ to: "/leads" }); },
  });

  if (leadQ.isLoading) return <div className="text-sm text-muted-foreground">Loading lead…</div>;
  if (leadQ.error) return <div className="text-sm text-destructive">{(leadQ.error as Error).message}</div>;
  const lead = leadQ.data!;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/leads" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="size-4" /> Back to leads
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing((v) => !v)}>
            <Pencil className="size-4" /> {editing ? "Cancel" : "Edit"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                <Trash2 className="size-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                <AlertDialogDescription>This removes {lead.full_name} and all related notes permanently.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deleteLead.mutate()}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {editing ? (
        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Edit lead</CardTitle>
            <CardDescription>Update the lead's details and status.</CardDescription>
          </CardHeader>
          <CardContent>
            <LeadForm
              initial={lead as any}
              submitLabel="Save changes"
              onSubmit={async (v) => {
                const { error } = await supabase.from("leads").update({
                  ...v,
                  phone: v.phone || null,
                  company: v.company || null,
                  notes: v.notes || null,
                  follow_up_date: v.follow_up_date || null,
                }).eq("id", id);
                if (error) { toast.error(error.message); return; }
                qc.invalidateQueries({ queryKey: ["lead", id] });
                qc.invalidateQueries({ queryKey: ["leads"] });
                toast.success("Lead updated");
                setEditing(false);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-[var(--shadow-card)]">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight">{lead.full_name}</h1>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-4">
                    <span className="inline-flex items-center gap-1.5"><Mail className="size-3.5" /> {lead.email}</span>
                    {lead.phone && <span className="inline-flex items-center gap-1.5"><Phone className="size-3.5" /> {lead.phone}</span>}
                    {lead.company && <span className="inline-flex items-center gap-1.5"><Building2 className="size-3.5" /> {lead.company}</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="secondary" className={statusBadgeClass(lead.status)}>{STATUS_LABEL[lead.status]}</Badge>
                  <span className="text-xs text-muted-foreground">Source: {SOURCE_LABEL[lead.source]}</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-6 text-sm">
                <Info label="Created" value={format(new Date(lead.created_at), "MMM d, yyyy")} />
                <Info label="Last updated" value={format(new Date(lead.updated_at), "MMM d, yyyy")} />
                <Info
                  label="Follow-up"
                  value={lead.follow_up_date ? format(new Date(lead.follow_up_date), "MMM d, yyyy") : "—"}
                  icon={<CalendarClock className="size-3.5" />}
                />
              </div>
              {lead.notes && (
                <div className="mt-6 rounded-md bg-muted/40 p-4">
                  <div className="text-xs uppercase font-medium text-muted-foreground tracking-wide mb-1">Summary</div>
                  <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Notes & activity</CardTitle>
              <CardDescription>Log calls, emails and meeting notes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Textarea
                  rows={2}
                  placeholder="Add a note…"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <Button
                  onClick={() => noteInput.trim() && addNote.mutate(noteInput.trim())}
                  disabled={!noteInput.trim() || addNote.isPending}
                  className="sm:self-end"
                >
                  Add note
                </Button>
              </div>
              <div className="space-y-3">
                {notesQ.isLoading && <div className="text-sm text-muted-foreground">Loading notes…</div>}
                {!notesQ.isLoading && (notesQ.data?.length ?? 0) === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-6">No notes yet.</div>
                )}
                {notesQ.data?.map((n) => (
                  <div key={n.id} className="rounded-md border bg-card p-4">
                    {editingNoteId === n.id ? (
                      <div className="space-y-2">
                        <Input value={editingNoteContent} onChange={(e) => setEditingNoteContent(e.target.value)} />
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="ghost" onClick={() => setEditingNoteId(null)}><X className="size-4" /> Cancel</Button>
                          <Button size="sm" onClick={() => updateNote.mutate({ noteId: n.id, content: editingNoteContent })}><Check className="size-4" /> Save</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm whitespace-pre-wrap">{n.content}</div>
                        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{format(new Date(n.created_at), "MMM d, yyyy · h:mm a")}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => { setEditingNoteId(n.id); setEditingNoteContent(n.content); }}>
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => deleteNote.mutate(n.id)}>
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className="text-sm font-medium mt-1 inline-flex items-center gap-1.5">{icon}{value}</div>
    </div>
  );
}
