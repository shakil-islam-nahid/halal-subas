"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("halalsubas@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError("Wrong email or password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-emerald-950 px-4 text-stone-50">
      <form
        onSubmit={submitLogin}
        className="w-full max-w-sm rounded border border-white/10 bg-white p-6 text-zinc-950 shadow-xl"
      >
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">
          Admin Login
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-emerald-950">Halal Subas</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Dashboard access korte admin email and password din.
        </p>

        <label className="mt-6 grid gap-2 text-sm font-semibold text-zinc-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 rounded border border-zinc-200 px-3"
            required
          />
        </label>

        <label className="mt-4 grid gap-2 text-sm font-semibold text-zinc-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 rounded border border-zinc-200 px-3"
            required
          />
        </label>

        <button className="mt-5 h-12 w-full rounded bg-emerald-950 font-bold text-amber-100">
          Login
        </button>
        {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
      </form>
    </main>
  );
}
