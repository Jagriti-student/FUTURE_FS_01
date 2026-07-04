import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LeadForm } from "@/components/lead-form";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/leads/new")({
  component: NewLeadPage,
});

function NewLeadPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <Link to="/leads" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
        <ArrowLeft className="size-4" /> Back to leads
      </Link>
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Add a new lead</CardTitle>
          <CardDescription>Capture contact details from your website, calls, or referrals.</CardDescription>
        </CardHeader>
        <CardContent>
          <LeadForm
            submitLabel="Create lead"
            onSubmit={async (v) => {
              const { data: u } = await supabase.auth.getUser();
              const payload = {
                full_name: v.full_name,
                email: v.email,
                phone: v.phone || null,
                company: v.company || null,
                source: v.source,
                status: v.status,
                notes: v.notes || null,
                follow_up_date: v.follow_up_date || null,
                created_by: u.user?.id ?? null,
              };
              const { data, error } = await supabase.from("leads").insert(payload).select("id").single();
              if (error) { toast.error(error.message); return; }
              qc.invalidateQueries({ queryKey: ["leads"] });
              toast.success("Lead created");
              navigate({ to: "/leads/$id", params: { id: data.id } });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
