import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 text-slate-900">
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-slate-600">
          Simple placeholder page. Use it to confirm the SMS login flow completes.
        </p>
        <div className="rounded-2xl border border-slate-200 p-6 text-sm text-slate-600">
          <p className="font-semibold text-slate-800">Links</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link className="text-slate-900 underline" href="/login">
                Back to login
              </Link>
            </li>
            <li>
              <Link className="text-slate-900 underline" href="/">
                Home
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
