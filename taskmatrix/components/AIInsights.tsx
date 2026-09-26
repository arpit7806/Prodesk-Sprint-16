import { useState } from 'react';
import { SkeletonLines } from './SkeletonLoader';
import { useToast } from './ToastProvider';

// IMPORTANT: this calls YOUR backend (Render), which then calls Gemini/OpenAI.
// Never call the Gemini/OpenAI API directly from the browser with a bare key —
// it ships your key to every visitor's devtools. If a backend route doesn't
// exist yet, add a one-liner proxy on Render (see the comment block at the
// bottom of this file) and point ENDPOINT at it.
const ENDPOINT = import.meta.env.VITE_AI_INSIGHTS_ENDPOINT || '/api/ai/insights';

// Pass in whatever slice of dashboard state you want summarized.
// <AIInsights dashboardData={{ tasks, sprintStats }} />
export function AIInsights({ dashboardData }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { showToast } = useToast();

  const generate = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dashboardData }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setSummary(data.summary);
      showToast('Insights generated', { type: 'success' });
    } catch (err) {
      console.error('[AIInsights]', err);
      setError(true);
      showToast('Could not generate insights', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tm-ai-insights">
      <button className="tm-btn" onClick={generate} disabled={loading}>
        {loading ? <span className="tm-spinner" /> : 'Generate Summary'}
      </button>

      {loading && <div style={{ marginTop: '1rem' }}><SkeletonLines count={3} /></div>}

      {!loading && error && (
        <p className="tm-error-fallback" style={{ marginTop: '1rem' }}>
          Something went wrong generating insights. Try again in a moment.
        </p>
      )}

      {!loading && !error && summary && (
        <p style={{ marginTop: '1rem', fontFamily: 'Rajdhani, sans-serif' }}>{summary}</p>
      )}
    </div>
  );
}

/*
Minimal Render/Express proxy route (keeps your API key server-side only):

app.post('/api/ai/insights', async (req, res) => {
  try {
    const { dashboardData } = req.body;
    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Summarize project dashboard data in 2-3 sentences.' },
          { role: 'user', content: JSON.stringify(dashboardData) },
        ],
      }),
    });
    const data = await aiRes.json();
    res.json({ summary: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: 'AI request failed' });
  }
});
*/
