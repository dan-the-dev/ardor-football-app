"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Credenziali non valide. Riprova.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ardor-black px-4">
      <div className="w-full max-w-sm rounded-2xl border border-ardor-gray bg-ardor-black-soft p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/logo.png"
            alt="Ardor"
            width={64}
            height={64}
            className="object-contain"
            priority
          />
          <h1 className="text-xl font-semibold tracking-tight">
            Ardor <span className="text-ardor-orange">Football Hub</span>
          </h1>
          <p className="text-sm text-gray-400">Accedi per continuare</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-ardor-gray bg-ardor-black px-3 py-2 text-sm text-white outline-none transition focus:border-ardor-orange focus:ring-1 focus:ring-ardor-orange"
              placeholder="nome@ardorbollate.it"
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-ardor-gray bg-ardor-black px-3 py-2 text-sm text-white outline-none transition focus:border-ardor-orange focus:ring-1 focus:ring-ardor-orange"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-ardor-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ardor-orange-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Accesso riservato allo staff Ardor Bollate Juniores.
        </p>
      </div>
    </div>
  );
}
