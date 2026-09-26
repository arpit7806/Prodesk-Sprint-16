async function callGeminiWithRetry(payload: any, apiKey: string, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) return res;

    // Retry only on transient errors (503 overloaded, 429 rate limit)
    if ((res.status === 503 || res.status === 429) && attempt < maxRetries) {
      const delay = 500 * 2 ** attempt; // 500ms, 1s, 2s...
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    return res; // non-retryable error, or retries exhausted
  }
  throw new Error("Unreachable");
}

export async function POST(req: Request) {
  const { dashboardData } = await req.json();

  const prompt = `You are a sprint analyst. Given this Kanban dashboard data, write a concise but substantive summary for the team.

Cover:
1. Overall sprint health (progress %, velocity, on-track or at-risk)
2. Any bottlenecks (e.g. columns backing up, high-priority items stuck)
3. Workload distribution across assignees, if imbalanced
4. One notable risk or thing to watch

Keep it to 4-5 sentences, plain prose, no headers or bullet points.

Dashboard data:
${JSON.stringify(dashboardData)}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: { maxOutputTokens: 5000 },
  };

  const aiRes = await callGeminiWithRetry(payload, process.env.GEMINI_API_KEY as string);

  if (!aiRes.ok) {
    const errText = await aiRes.text();
    console.error("Gemini API error:", errText);
    return Response.json({ error: "AI request failed" }, { status: 502 });
  }

  const data = await aiRes.json();
  const candidate = data.candidates?.[0];
  const summary = candidate?.content?.parts?.[0]?.text;

  if (!summary) {
    console.error("Unexpected Gemini response shape:", JSON.stringify(data));
    return Response.json({ error: "AI request failed" }, { status: 500 });
  }

  if (candidate.finishReason === "MAX_TOKENS") {
    console.warn("Gemini response was truncated by maxOutputTokens limit");
  }

  return Response.json({ summary });
}