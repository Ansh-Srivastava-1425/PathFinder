import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { question } = await req.json();
    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are PathFinder AI, a career advisor for Indian engineering students. Answer concisely in 3-5 sentences. Focus on practical, India-specific advice including salary ranges in LPA, relevant companies hiring in India, and realistic timelines.' },
        { role: 'user', content: question }
      ]
    });
    return Response.json({ reply: result.choices[0].message.content });
  } catch (err) {
    console.error('Advisor API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
