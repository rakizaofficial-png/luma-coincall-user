/**
 * Client session for Zuko Android user app.
 * Production shape: replace verify with JWT from CoinCall `/auth/*` when ready.
 * Never trusts client for wallet/admin — only identity for UX + X-User-Id.
 */

const SESSION_KEY = "zuko_user_session_v1";
const USERS_KEY = "zuko_local_users_v1";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  createdAt: number;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
  expiresAt: number;
};

type StoredUser = AuthUser & { passwordHash: string };

function hashPassword(password: string): string {
  // Lightweight client hash (not a substitute for server bcrypt). Backend must verify.
  let h = 2166136261;
  const s = `zuko:${password}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `h${(h >>> 0).toString(16)}`;
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as AuthSession;
    if (!s?.token || !s.user?.email) return null;
    if (s.expiresAt && s.expiresAt < Date.now()) {
      clearSession();
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

function issueSession(user: AuthUser): AuthSession {
  const session: AuthSession = {
    token: `zuko_${user.id}_${Date.now().toString(36)}`,
    user,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function registerAccount(input: {
  email: string;
  password: string;
  name: string;
}): Promise<AuthSession> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim() || "Zuko Fan";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email");
  }
  if (input.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error("Email already registered");
  }
  const user: StoredUser = {
    id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    email,
    name,
    createdAt: Date.now(),
    passwordHash: hashPassword(input.password),
  };
  writeUsers([user, ...users]);
  return issueSession({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  });
}

export async function loginAccount(input: {
  email: string;
  password: string;
}): Promise<AuthSession> {
  const email = input.email.trim().toLowerCase();
  const users = readUsers();
  const hit = users.find((u) => u.email === email);
  if (!hit || hit.passwordHash !== hashPassword(input.password)) {
    throw new Error("Invalid email or password");
  }
  return issueSession({
    id: hit.id,
    email: hit.email,
    name: hit.name,
    createdAt: hit.createdAt,
  });
}

export async function requestPasswordReset(email: string): Promise<string> {
  const e = email.trim().toLowerCase();
  const users = readUsers();
  const hit = users.find((u) => u.email === e);
  if (!hit) throw new Error("No account with that email");
  const code = String(100000 + Math.floor(Math.random() * 900000));
  sessionStorage.setItem(
    "zuko_reset_pending",
    JSON.stringify({ email: e, code, at: Date.now() }),
  );
  return code; // Demo: surface code in UI; production emails via API
}

export async function resetPassword(input: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<void> {
  const raw = sessionStorage.getItem("zuko_reset_pending");
  if (!raw) throw new Error("Request a reset code first");
  const pending = JSON.parse(raw) as { email: string; code: string; at: number };
  if (pending.email !== input.email.trim().toLowerCase()) {
    throw new Error("Email mismatch");
  }
  if (pending.code !== input.code.trim()) throw new Error("Invalid reset code");
  if (Date.now() - pending.at > 15 * 60 * 1000) {
    throw new Error("Code expired — request a new one");
  }
  if (input.newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  const users = readUsers();
  const idx = users.findIndex((u) => u.email === pending.email);
  if (idx < 0) throw new Error("Account not found");
  users[idx] = {
    ...users[idx]!,
    passwordHash: hashPassword(input.newPassword),
  };
  writeUsers(users);
  sessionStorage.removeItem("zuko_reset_pending");
}

export function logoutAccount() {
  clearSession();
}
