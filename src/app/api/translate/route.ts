// src/app/api/translate/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang, targetLang, model, apiKey } = await req.json();

    const key = apiKey || process.env.OPENROUTER_API_KEY;
    if (!key || key === 'placeholder_key_here') {
      return NextResponse.json(
        { error: 'No API key configured. Please add your OpenRouter API key in Settings.' },
        { status: 401 }
      );
    }

    const systemPrompt = `You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}. 
Return ONLY the translated text, nothing else. Preserve the original formatting, tone, and meaning as closely as possible.`;

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
    const translatedText = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ translatedText });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
