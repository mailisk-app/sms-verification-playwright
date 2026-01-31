"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleSmsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const phoneEntry = formData.get("phone");
    const phone = typeof phoneEntry === "string" ? phoneEntry.trim() : "";

    if (!phone) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/login/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      form.reset();
      router.push("/login/verify");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-slate-900">
      <div className="mx-auto flex max-w-md flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Login</h1>
        </header>

        <section className="rounded-2xl border border-slate-200 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            SMS login
          </p>
          <form className="mt-4 space-y-4" onSubmit={handleSmsSubmit}>
            <label htmlFor="phone" className="text-sm font-semibold">
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+11234567890"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base"
              required
            />
            <button
              type="submit"
              className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending…" : "Send code"}
            </button>
            {status === "error" && (
              <p className="text-xs text-red-600">
                Something went wrong. Try again.
              </p>
            )}
          </form>
          <p className="mt-4 text-xs text-slate-500">
            After submitting you will be sent to{" "}
            <Link href="/login/verify">/login/verify</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
