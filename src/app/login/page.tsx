"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthField,
  AuthPrimaryButton,
  AuthShell,
} from "@/components/auth/AuthShell";
import { loginWithPassword } from "@/lib/authSession";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { pushToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await loginWithPassword({ email, password });
      pushToast("Welcome back");
      router.push("/");
    } catch (e: unknown) {
      pushToast(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Secure login for your Zuko wallet, calls, and VIP."
      footer={
        <div className="space-y-2">
          <p>
            New here?{" "}
            <Link href="/register" className="font-bold text-coral">
              Create an account
            </Link>
          </p>
          <Link href="/forgot-password" className="font-bold text-coral">
            Forgot password?
          </Link>
        </div>
      }
    >
      <AuthField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        placeholder="you@email.com"
      />
      <AuthField
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
      />
      <AuthPrimaryButton loading={loading} onClick={() => void submit()}>
        Sign in
      </AuthPrimaryButton>
    </AuthShell>
  );
}
