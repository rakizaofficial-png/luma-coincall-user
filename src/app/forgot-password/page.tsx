"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthField,
  AuthPrimaryButton,
  AuthShell,
} from "@/components/auth/AuthShell";
import { requestPasswordReset } from "@/lib/authSession";
import { useApp } from "@/lib/store";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { pushToast } = useApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    try {
      const code = await requestPasswordReset(email);
      setDemoCode(code);
      pushToast("Reset code ready — enter it on the next screen");
      router.push(
        `/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`,
      );
    } catch (e: unknown) {
      pushToast(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We’ll issue a short-lived reset code for your account."
      footer={
        <Link href="/login" className="font-bold text-coral">
          Back to sign in
        </Link>
      }
    >
      <AuthField
        label="Account email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        placeholder="you@email.com"
      />
      <AuthPrimaryButton loading={loading} onClick={() => void submit()}>
        Send reset code
      </AuthPrimaryButton>
      {demoCode ? (
        <p className="rounded-xl bg-gold/10 px-3 py-2 text-center text-xs text-gold">
          Demo code: <strong>{demoCode}</strong> (production emails via API)
        </p>
      ) : (
        <p className="text-center text-[11px] text-muted">
          Production builds email the code securely via the CoinCall API.
        </p>
      )}
    </AuthShell>
  );
}
