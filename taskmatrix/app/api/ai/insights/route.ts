export async function POST(req: Request) {
  const { dashboardData } = await req.json();

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
  return Response.json({ summary: data.choices[0].message.content });
}