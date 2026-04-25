// src/app/api/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, language, model, apiKey } = await req.json();

    const key = apiKey || process.env.OPENROUTER_API_KEY;
    if (!key || key === 'placeholder_key_here') {
      return NextResponse.json(
        { error: 'No API key configured. Please add your OpenRouter API key in Settings.' },
        { status: 401 }
      );
    }

    const systemPrompt = `You are an expert programmer. Generate clean, well-commented, production-quality code.
When the user describes what they want, generate the code in ${language}.
Return ONLY the code wrapped in a single markdown code block with the appropriate language tag.
Do not include any explanation outside the code block unless specifically asked.`;

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
          { role: 'user', content: prompt },
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
    const content = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ code: content });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
