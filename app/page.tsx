import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900">
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <h1 className="text-3xl font-semibold">SMS login demo</h1>
        <p className="text-slate-600">
          Minimal placeholder pages for the flow.
        </p>
        <Link
          href="/login"
          className="inline-flex w-fit items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Go to login
        </Link>
      </div>
    </main>
  );
}
