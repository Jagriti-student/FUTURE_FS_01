import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setNewPassword("");
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account.</p>
      </div>
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Signed in as {email || "…"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="space-y-3 max-w-sm">
            <div className="space-y-1.5">
              <Label htmlFor="np">New password</Label>
              <Input id="np" type="password" minLength={8} value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" />
            </div>
            <Button type="submit">Update password</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>End your session on this device.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={signOut}><LogOut className="size-4" /> Log out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
