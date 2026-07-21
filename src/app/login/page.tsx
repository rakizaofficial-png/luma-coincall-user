"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthField,
  AuthPrimaryButton,
  AuthShell,
} from "@/components/auth/AuthShell";
import { loginAccount } from "@/lib/authSession";
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
      const session = await loginAccount({ email, password });
      pushToast(`Welcome back, ${session.user.name}`);
      router.replace("/profile");
    } catch (e: unknown) {
      pushToast(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Secure session for your Zuko wallet, calls, and VIP."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-bold text-coral">
            Create account
          </Link>
        </>
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
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs font-semibold text-cyan"
        >
          Forgot password?
        </Link>
      </div>
      <AuthPrimaryButton loading={loading} onClick={() => void submit()}>
        Sign in
      </AuthPrimaryButton>
      <p className="pt-1 text-center text-[11px] text-muted">
        Google Sign-In connects when Play Services + backend OAuth are enabled.
      </p>
    </AuthShell>
  );
}
