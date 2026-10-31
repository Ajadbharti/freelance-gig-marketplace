"use client";

import { useEffect, useState } from "react";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const missing = !url || !key || url.includes("yahan-") || key.includes("yahan-");

export default function SupabaseTestPage() {
  const [result, setResult] = useState("Checking...");

  useEffect(() => {
    if (missing) return;
    fetch(`${url}/auth/v1/health`, { headers: { apikey: key } })
      .then((res) =>
        setResult(res.ok ? "Connected to Supabase successfully." : `Supabase answered with status ${res.status}.`)
      )
      .catch((error) => setResult(`Could not reach Supabase: ${error.message}`));
  }, []);

  return (
    <main className="mx-auto max-w-xl p-10">
      <h1 className="text-2xl font-bold">Supabase connection test</h1>
      <p className="mt-4 text-slate-700">
        {missing ? "The .env.local values are missing or still placeholders. Fill them and restart npm run dev." : result}
      </p>
    </main>
  );
}