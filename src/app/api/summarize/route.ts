// src/app/api/summarize/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, format, model, apiKey } = await req.json();

    const key = apiKey || process.env.OPENROUTER_API_KEY;
    if (!key || key === 'placeholder_key_here') {
      return NextResponse.json(
        { error: 'No API key configured. Please add your OpenRouter API key in Settings.' },
        { status: 401 }
      );
    }

    const formatInstructions: Record<string, string> = {
      bullets: 'Summarize the following text as a concise bullet-point list. Use markdown bullet points.',
      paragraph: 'Summarize the following text in a concise paragraph.',
      takeaways: 'Extract the key takeaways from the following text. Format as numbered key points with brief explanations.',
    };

    const systemPrompt = formatInstructions[format] || formatInstructions.bullets;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: model || 'google/gemini-2.0-flash-exp:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ summary });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
