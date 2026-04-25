// src/lib/conversations.ts

import { Conversation, Message } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_MODEL } from './constants';

const CONVERSATIONS_KEY = 'wir-ai-conversations';

export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return [];
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function createConversation(model?: string): Conversation {
  return {
    id: uuidv4(),
    title: 'New Chat',
    messages: [],
    model: model || DEFAULT_MODEL,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function addMessage(
  conversation: Conversation,
  role: Message['role'],
  content: string
): Message {
  const message: Message = {
    id: uuidv4(),
    role,
    content,
    timestamp: Date.now(),
  };
  conversation.messages.push(message);
  conversation.updatedAt = Date.now();
  if (conversation.messages.length === 1 && role === 'user') {
    conversation.title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
  }
  return message;
}
