export const dynamic = 'force-dynamic'

export async function POST(req) {
  try {
    const { question, systemPrompt } = await req.json();

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt || 'You are Dishant AI, a career advisor for Indian engineering students. Answer concisely in 3-5 sentences. Focus on practical, India-specific advice including salary ranges in LPA, relevant companies hiring in India, and realistic timelines.'
          },
          { role: 'user', content: question }
        ]
      })
    });

    const data = await response.json();
    return Response.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error('Advisor API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
