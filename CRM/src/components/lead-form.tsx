import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  SOURCE_LABEL, SOURCE_OPTIONS, STATUS_LABEL, STATUS_OPTIONS,
  type LeadSource, type LeadStatus,
} from "@/lib/lead-utils";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email").max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  source: z.enum(SOURCE_OPTIONS as [LeadSource, ...LeadSource[]]),
  status: z.enum(STATUS_OPTIONS as [LeadStatus, ...LeadStatus[]]),
  notes: z.string().max(2000).optional().or(z.literal("")),
  follow_up_date: z.string().optional().or(z.literal("")),
});

export type LeadFormValues = z.infer<typeof schema>;

export function LeadForm({
  initial, submitLabel = "Save", onSubmit,
}: {
  initial?: Partial<LeadFormValues>;
  submitLabel?: string;
  onSubmit: (values: LeadFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState<LeadFormValues>({
    full_name: initial?.full_name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    company: initial?.company ?? "",
    source: (initial?.source as LeadSource) ?? "website",
    status: (initial?.status as LeadStatus) ?? "new",
    notes: initial?.notes ?? "",
    follow_up_date: initial?.follow_up_date ?? "",
  });
  const [busy, setBusy] = useState(false);

  function setField<K extends keyof LeadFormValues>(k: K, v: LeadFormValues[K]) {
    setValues((s) => ({ ...s, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) return toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
    setBusy(true);
    try { await onSubmit(parsed.data); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name *">
          <Input value={values.full_name} onChange={(e) => setField("full_name", e.target.value)} />
        </Field>
        <Field label="Email *">
          <Input type="email" value={values.email} onChange={(e) => setField("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={values.phone ?? ""} onChange={(e) => setField("phone", e.target.value)} />
        </Field>
        <Field label="Company">
          <Input value={values.company ?? ""} onChange={(e) => setField("company", e.target.value)} />
        </Field>
        <Field label="Source">
          <Select value={values.source} onValueChange={(v) => setField("source", v as LeadSource)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SOURCE_OPTIONS.map((s) => <SelectItem key={s} value={s}>{SOURCE_LABEL[s]}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Status">
          <Select value={values.status} onValueChange={(v) => setField("status", v as LeadStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Follow-up date">
          <Input type="date" value={values.follow_up_date ?? ""} onChange={(e) => setField("follow_up_date", e.target.value)} />
        </Field>
      </div>
      <Field label="Notes">
        <Textarea rows={4} value={values.notes ?? ""} onChange={(e) => setField("notes", e.target.value)}
          placeholder="Context, requirements, next steps…" />
      </Field>
      <div className="flex justify-end">
        <Button type="submit" disabled={busy} className="shadow-[var(--shadow-elegant)]">
          {busy && <Loader2 className="size-4 animate-spin" />} {submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
