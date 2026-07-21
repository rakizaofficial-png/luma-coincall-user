"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AuthField,
  AuthPrimaryButton,
  AuthShell,
} from "@/components/auth/AuthShell";
import { resetPassword } from "@/lib/authSession";
import { useApp } from "@/lib/store";

function ResetPasswordForm() {
  const router = useRouter();
  const search = useSearchParams();
  const { pushToast } = useApp();
  const [email, setEmail] = useState(search.get("email") || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await resetPassword({ email, code, newPassword: password });
      pushToast("Password updated — sign in");
      router.replace("/login");
    } catch (e: unknown) {
      pushToast(e instanceof Error ? e.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter the code and choose a new password."
      footer={
        <Link href="/forgot-password" className="font-bold text-coral">
          Request a new code
        </Link>
      }
    >
      <AuthField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@email.com"
      />
      <AuthField
        label="Reset code"
        value={code}
        onChange={setCode}
        placeholder="6-digit code"
      />
      <AuthField
        label="New password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        placeholder="At least 6 characters"
      />
      <AuthPrimaryButton loading={loading} onClick={() => void submit()}>
        Update password
      </AuthPrimaryButton>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center text-sm text-muted">
          Loading…
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
