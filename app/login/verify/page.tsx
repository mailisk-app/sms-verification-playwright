"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const codeEntry = formData.get("code");
    const code = typeof codeEntry === "string" ? codeEntry.trim() : "";

    if (!code) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/login/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      form.reset();
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-16 text-slate-900">
      <div className="mx-auto flex max-w-sm flex-col gap-6">
        <header>
          <h1 className="text-3xl font-semibold">Verify code</h1>
          <p className="mt-2 text-sm text-slate-600">
            Static form. Fill the field below and submit to continue.
          </p>
        </header>

        <form
          className="space-y-4 rounded-2xl border border-slate-200 p-6"
          onSubmit={handleVerify}
        >
          <label htmlFor="code" className="text-sm font-semibold">
            6-digit code
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            placeholder="123456"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-center text-2xl tracking-[0.4em]"
            required
          />
          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Checking…" : "Continue"}
          </button>
          {status === "error" && (
            <p className="text-xs text-red-600">
              Verification failed. Try again.
            </p>
          )}
          <p className="text-xs text-slate-600">
            Example flow ends on <Link href="/dashboard">/dashboard</Link>.
          </p>
        </form>
      </div>
    </main>
  );
}
