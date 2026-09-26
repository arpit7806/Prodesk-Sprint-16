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
      <button className="tm-generate-btn" onClick={generate} disabled={loading}>
        {loading ? (
          <span className="tm-spinner" />
        ) : (
          <>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
                fill="currentColor"
              />
            </svg>
            Generate Summary
          </>
        )}
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

      <style jsx>{`
        .tm-generate-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.1rem;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          color: #fff;
          font-family: "Rajdhani", sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(124, 58, 237, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }

        .tm-generate-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(124, 58, 237, 0.5);
        }

        .tm-generate-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(124, 58, 237, 0.4);
        }

        .tm-generate-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .tm-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: tm-spin 0.6s linear infinite;
        }

        @keyframes tm-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}