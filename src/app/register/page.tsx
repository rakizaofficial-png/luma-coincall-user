"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthField,
  AuthPrimaryButton,
  AuthShell,
} from "@/components/auth/AuthShell";
import { registerAccount } from "@/lib/authSession";
import { useApp } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const { pushToast, updateDisplayName } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const session = await registerAccount({ email, password, name });
      await updateDisplayName(session.user.name);
      pushToast("Account created — welcome to Zuko");
      router.replace("/profile");
    } catch (e: unknown) {
      pushToast(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Register to sync profile, protect your coins, and join VIP."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-coral">
            Sign in
          </Link>
        </>
      }
    >
      <AuthField
        label="Display name"
        value={name}
        onChange={setName}
        placeholder="Your name"
        autoComplete="name"
      />
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
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        placeholder="At least 6 characters"
      />
      <AuthPrimaryButton loading={loading} onClick={() => void submit()}>
        Register
      </AuthPrimaryButton>
      <p className="pt-1 text-center text-[11px] text-muted">
        Wallet balances &amp; prices are server-controlled — never editable by
        users.
      </p>
    </AuthShell>
  );
}
