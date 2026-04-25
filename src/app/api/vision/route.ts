// src/app/api/vision/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, imageBase64, prompt, model, apiKey } = await req.json();

    const key = apiKey || process.env.OPENROUTER_API_KEY;
    if (!key || key === 'placeholder_key_here') {
      return NextResponse.json(
        { error: 'No API key configured. Please add your OpenRouter API key in Settings.' },
        { status: 401 }
      );
    }

    const imageContent = imageBase64
      ? { type: 'image_url' as const, image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      : { type: 'image_url' as const, image_url: { url: imageUrl } };

    const messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt || 'Analyze this image in detail. Describe what you see, including objects, colors, composition, text, and any notable features.' },
          imageContent,
        ],
      },
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model: model || 'google/gemini-2.0-flash-exp:free',
        messages,
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
    const content = data.choices?.[0]?.message?.content || 'No analysis available.';

    return NextResponse.json({ description: content });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
