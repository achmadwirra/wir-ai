// src/lib/openrouter.ts
// All API calls happen directly from browser to OpenRouter
// API key NEVER touches our server

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export async function chatCompletion(
  apiKey: string,
  model: string,
  messages: { role: string; content: string | any[] }[],
  stream: boolean = false
) {
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
      'X-Title': 'Wir AI',
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.error?.message || `API Error: ${response.status}`);
  }

  return response;
}

// For non-streaming: returns the parsed JSON response
export async function chatCompletionJSON(
  apiKey: string,
  model: string,
  messages: { role: string; content: string | any[] }[]
) {
  const response = await chatCompletion(apiKey, model, messages, false);
  const data = await response.json();
  return data;
}

// For streaming chat
export async function* streamChat(
  apiKey: string,
  model: string,
  messages: { role: string; content: string | any[] }[]
) {
  const response = await chatCompletion(apiKey, model, messages, true);
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) throw new Error('No response body');

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    // Keep the last potentially incomplete line in the buffer
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          throw new Error(parsed.error.message || 'Stream error from API');
        }
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch (e) {
        // Only re-throw actual API errors, skip JSON parse errors from partial chunks
        if (e instanceof Error && !e.message.includes('JSON')) {
          throw e;
        }
      }
    }
  }

  // Process any remaining buffer
  if (buffer.trim()) {
    const trimmed = buffer.trim();
    if (trimmed.startsWith('data: ') && trimmed.slice(6) !== '[DONE]') {
      try {
        const parsed = JSON.parse(trimmed.slice(6));
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // ignore
      }
    }
  }
}
