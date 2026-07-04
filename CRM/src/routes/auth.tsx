import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

const DEMO_EMAIL = "admin@demo.com";
const DEMO_PASSWORD = "DemoAdmin!2026";

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);

  async function signIn(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    navigate({ to: "/dashboard", replace: true });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name }, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — signing you in");
    navigate({ to: "/dashboard", replace: true });
  }

  async function useDemo() {
    setLoading(true);
    let { error } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
    if (error) {
      const signupRes = await supabase.auth.signUp({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        options: { data: { full_name: "Demo Admin" }, emailRedirectTo: window.location.origin },
      });
      if (signupRes.error) {
        setLoading(false);
        return toast.error(signupRes.error.message);
      }
      ({ error } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      }));
    }
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in as demo admin");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden"
        style={{ background: "var(--gradient-primary)" }}>
        <div className="flex items-center gap-2 font-semibold text-lg">
          <div className="size-8 rounded-lg bg-white/15 grid place-items-center backdrop-blur">
            <Sparkles className="size-4" />
          </div>
          Customer Connect Hub
        </div>
        <div className="space-y-4 max-w-md relative">
          <h1 className="text-4xl font-bold tracking-tight">Turn website visitors into customers.</h1>
          <p className="text-white/85">
            A modern CRM for capturing, qualifying and converting leads — built for small teams who
            move fast.
          </p>
        </div>
        <div className="text-sm text-white/70">© {new Date().getFullYear()} Customer Connect Hub</div>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border/60 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Sign in to your workspace</CardTitle>
            <CardDescription>Access your leads, pipeline and follow-ups.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Create account</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="space-y-4 pt-4">
                <form onSubmit={signIn} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password}
                      onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="size-4 animate-spin" />} Sign in
                  </Button>
                </form>
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={useDemo} disabled={loading}>
                  Try with demo account
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {DEMO_EMAIL} · {DEMO_PASSWORD}
                </p>
              </TabsContent>
              <TabsContent value="signup" className="space-y-4 pt-4">
                <form onSubmit={signUp} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email2">Email</Label>
                    <Input id="email2" type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password2">Password</Label>
                    <Input id="password2" type="password" required minLength={8} value={password}
                      onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading && <Loader2 className="size-4 animate-spin" />} Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="text-xs text-muted-foreground text-center mt-6">
              <Link to="/dashboard" className="hover:underline">Already signed in? Open dashboard →</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
