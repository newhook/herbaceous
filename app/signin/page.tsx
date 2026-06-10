import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { authenticate } from "@/app/actions";
import { AuthForm } from "@/app/auth-form";

export default async function SignInPage() {
  if (await auth()) redirect("/dashboard");

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-4xl">🌿</div>
          <h1 className="mt-3 text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Sign in to see your herb recommendations.
          </p>
        </div>

        <AuthForm action={authenticate} submitLabel="Sign in">
          <Field label="Email" name="email" type="email" autoComplete="email" />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
          />
        </AuthForm>

        <p className="mt-6 text-center text-sm text-black/60 dark:text-white/60">
          New here?{" "}
          <Link href="/signup" className="font-medium text-green-700 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field(props: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{props.label}</span>
      <input
        name={props.name}
        type={props.type}
        autoComplete={props.autoComplete}
        required
        className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-green-600 dark:border-white/20"
      />
    </label>
  );
}
