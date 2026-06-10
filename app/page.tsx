import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-2xl">
        <div className="mb-6 text-6xl">🌿</div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Herbaceous
        </h1>
        <p className="mt-4 text-lg text-black/70 dark:text-white/70">
          Tell us what you love to eat, and we&apos;ll recommend the perfect
          herbs to plant in your garden — so your kitchen and your soil grow
          together.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {session?.user ? (
            <Link
              href="/dashboard"
              className="rounded-full bg-green-700 px-6 py-3 font-medium text-white transition hover:bg-green-800"
            >
              Go to your garden →
            </Link>
          ) : (
            <>
              <Link
                href="/signup"
                className="rounded-full bg-green-700 px-6 py-3 font-medium text-white transition hover:bg-green-800"
              >
                Get started — it&apos;s free
              </Link>
              <Link
                href="/signin"
                className="rounded-full border border-black/15 px-6 py-3 font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                Sign in
              </Link>
            </>
          )}
        </div>

        <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
          {[
            { icon: "🍝", title: "Pick your tastes", body: "Choose the cuisines and dishes you crave most." },
            { icon: "🧠", title: "Get matched", body: "Our recommender maps your likes to herbs that suit them." },
            { icon: "🪴", title: "Plant & cook", body: "Grow a garden that stocks your kitchen." },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-black/10 p-5 dark:border-white/15"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-2 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-black/60 dark:text-white/60">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
