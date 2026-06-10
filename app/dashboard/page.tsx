import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logout } from "@/app/actions";
import { Recommender } from "./recommender";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const firstName = session.user.name?.split(" ")[0] ?? "gardener";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-black/60 dark:text-white/60">Welcome back,</p>
          <h1 className="text-2xl font-bold">{firstName} 🌿</h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Sign out
          </button>
        </form>
      </header>

      <p className="mt-6 text-black/70 dark:text-white/70">
        Pick the foods you love and we&apos;ll suggest herbs worth planting.
      </p>

      <div className="mt-6">
        <Recommender />
      </div>
    </main>
  );
}
