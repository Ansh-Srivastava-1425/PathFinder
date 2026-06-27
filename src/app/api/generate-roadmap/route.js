export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { fieldName, fieldSlug } = await req.json();

    const systemPrompt = `You are a career roadmap expert for Indian engineering students. Generate a complete 10-step learning roadmap for the field: '${fieldName}'. Return ONLY a valid JSON array with exactly 10 objects, no extra text, no markdown. Each object must have: { "step": "Step N", "name": "step title", "meta": "X weeks • N Projects", "locked": false }. Steps should go from absolute beginner to job-ready. Make it practical for Indian students with no expensive tools required.`;

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
            content: systemPrompt
          },
          { role: 'user', content: "Return the JSON array of exactly 10 objects." }
        ]
      })
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response from Groq API");
    }

    let jsonString = data.choices[0].message.content.trim();
    if (jsonString.startsWith("\`\`\`json")) jsonString = jsonString.slice(7, -3).trim();
    else if (jsonString.startsWith("\`\`\`")) jsonString = jsonString.slice(3, -3).trim();
    
    const parsedData = JSON.parse(jsonString);
    return Response.json({ steps: parsedData });
  } catch (err) {
    console.error('Generate roadmap API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
