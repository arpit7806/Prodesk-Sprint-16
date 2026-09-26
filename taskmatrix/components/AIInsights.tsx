"use client";

import { useState } from "react";
import { SkeletonLines } from "./SkeletonLoader";
import { useToast } from "./ToastProvider";

// Calls YOUR backend (a Next.js Route Handler at app/api/ai/insights/route.ts),
// which then calls the Claude/OpenAI/Gemini API. Never call an AI provider
// directly from the browser with a bare key — it ships your key to every
// visitor's devtools.
const ENDPOINT = process.env.NEXT_PUBLIC_AI_INSIGHTS_ENDPOINT || "/api/ai/insights";

interface Props {
  dashboardData: unknown;
}

export function AIInsights({ dashboardData }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { showToast } = useToast();

  const generate = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dashboardData }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setSummary(data.summary);
      showToast("Insights generated", { type: "success" });
    } catch (err) {
      console.error("[AIInsights]", err);
      setError(true);
      showToast("Could not generate insights", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tm-ai-insights">
      <button className="tm-btn" onClick={generate} disabled={loading}>
        {loading ? <span className="tm-spinner" /> : "Generate Summary"}
      </button>

      {loading && (
        <div style={{ marginTop: "1rem" }}>
          <SkeletonLines count={3} />
        </div>
      )}

      {!loading && error && (
        <p className="tm-error-fallback" style={{ marginTop: "1rem" }}>
          Something went wrong generating insights. Try again in a moment.
        </p>
      )}

      {!loading && !error && summary && (
        <p style={{ marginTop: "1rem", fontFamily: "Rajdhani, sans-serif" }}>{summary}</p>
      )}
    </div>
  );
}