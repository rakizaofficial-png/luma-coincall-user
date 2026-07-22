"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AuthField,
  AuthPrimaryButton,
  AuthShell,
} from "@/components/auth/AuthShell";
import { registerWithPassword } from "@/lib/authSession";
import { useApp } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const { pushToast } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await registerWithPassword({ name, email, password });
      pushToast("Account created");
      router.push("/");
    } catch (e: unknown) {
      pushToast(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Join Zuko with email and password. No OTP required."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-coral">
            Sign in
          </Link>
        </p>
      }
    >
      <AuthField
        label="Name"
        autoComplete="name"
        value={name}
        onChange={setName}
        placeholder="Your name"
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
        Create account
      </AuthPrimaryButton>
    </AuthShell>
  );
}
