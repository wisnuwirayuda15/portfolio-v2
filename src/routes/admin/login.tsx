import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { MonoLabel } from "@/components/editorial/mono-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserFn } from "@/lib/supabase/auth";
import { getBrowserClient } from "@/lib/supabase/client";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: async () => {
    const user = await getUserFn();
    if (user) throw redirect({ to: "/admin" });
  },
  head: () => ({
    meta: [
      { name: "robots", content: "noindex" },
      { title: "Admin Login — Portfolio" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  const submit = async (fd: FormData) => {
    setPending(true);
    const { error } = await getBrowserClient().auth.signInWithPassword({
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
    });
    if (error) {
      toast.error(error.message);
      setPending(false);
      return;
    }
    await router.invalidate();
    navigate({ to: "/admin" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <MonoLabel>Admin</MonoLabel>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
          Sign in.
        </h1>
        <form
          className="mt-8 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit(new FormData(e.currentTarget));
          }}
        >
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" disabled={pending} className="mt-2">
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
