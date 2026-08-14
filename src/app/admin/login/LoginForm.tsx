"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { clientAuth } from "@/lib/firebase-client";
import { loginWithFirebaseAction } from "@/lib/auth-actions";

function firebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    default:
      return "Sign-in failed. Please try again.";
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resetPending, setResetPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setPending(true);
    try {
      const credential = await signInWithEmailAndPassword(
        clientAuth,
        email.trim(),
        password
      );
      const idToken = await credential.user.getIdToken();
      const result = await loginWithFirebaseAction(idToken);
      if (result?.error) setError(result.error);
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      setError(firebaseErrorMessage(code));
    } finally {
      setPending(false);
    }
  }

  async function handleForgotPassword() {
    setError(null);
    setInfo(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Enter your email above first, then tap \"Forgot password\".");
      return;
    }
    setResetPending(true);
    try {
      await sendPasswordResetEmail(clientAuth, trimmed);
      setInfo("Password reset email sent — check your inbox.");
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      setError(firebaseErrorMessage(code));
    } finally {
      setResetPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-white/70 mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a3d]/60 transition"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-white/70"
          >
            Password
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetPending}
            className="text-xs text-[#ff8a1c] hover:underline disabled:opacity-60"
          >
            {resetPending ? "Sending..." : "Forgot password?"}
          </button>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff6a3d]/60 transition"
          placeholder="Enter admin password"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {info && <p className="text-sm text-emerald-400">{info}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-gradient-to-r from-[#ff2d55] to-[#ff8a1c] text-white font-semibold py-2.5 hover:brightness-110 transition disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
