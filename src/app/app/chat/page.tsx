// src/app/app/chat/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  Bot,
  User,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message } from '@/types';
import { getApiKey, getDefaultModel } from '@/lib/settings';
import { AI_MODELS } from '@/lib/constants';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import ModelSelector from '@/components/ui/ModelSelector';
import ApiKeyWarning from '@/components/ui/ApiKeyWarning';
import LoadingDots from '@/components/ui/LoadingDots';

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [model, setModel] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wir-ai-conversations');
    if (stored) {
      const parsed: Conversation[] = JSON.parse(stored);
      setConversations(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
    }
    setModel(getDefaultModel());
    setHasApiKey(!!getApiKey());
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('wir-ai-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, activeId]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  const createNewChat = useCallback(() => {
    const newConv: Conversation = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      model: model || getDefaultModel(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
    setInput('');
    textareaRef.current?.focus();
  }, [model]);

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (activeId === id) {
        setActiveId(filtered.length > 0 ? filtered[0].id : null);
      }
      if (filtered.length === 0) {
        localStorage.removeItem('wir-ai-conversations');
      }
      return filtered;
    });
  };

  const copyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const apiKey = getApiKey();
    if (!apiKey) {
      setHasApiKey(false);
      return;
    }

    let currentConv = activeConversation;
    if (!currentConv) {
      const newConv: Conversation = {
        id: uuidv4(),
        title: input.slice(0, 50) + (input.length > 50 ? '...' : ''),
        messages: [],
        model,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      currentConv = newConv;
      setConversations((prev) => [newConv, ...prev]);
      setActiveId(newConv.id);
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    const convId = currentConv.id;

    // Update title if first message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const title = c.messages.length === 0
          ? input.trim().slice(0, 50) + (input.trim().length > 50 ? '...' : '')
          : c.title;
        return {
          ...c,
          title,
          messages: [...c.messages, userMessage, assistantMessage],
          updatedAt: Date.now(),
        };
      })
    );

    setInput('');
    setIsStreaming(true);

    try {
      const allMessages = [...(currentConv.messages || []), userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages,
          model,
          apiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response stream');

      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.content) {
              fullContent += parsed.content;
              setConversations((prev) =>
                prev.map((c) => {
                  if (c.id !== convId) return c;
                  return {
                    ...c,
                    messages: c.messages.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, content: fullContent }
                        : m
                    ),
                  };
                })
              );
            }
          } catch (e) {
            if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
              // Only throw real errors, not partial JSON
              if (e.message !== 'Unexpected end of JSON input' && !e.message.includes('JSON')) {
                throw e;
              }
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMessage.id
                ? { ...m, content: `⚠️ Error: ${errorMessage}` }
                : m
            ),
          };
        })
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-full">
      {/* Conversation sidebar */}
      <div className="hidden w-64 flex-col border-r border-white/10 bg-black/20 md:flex">
        <div className="p-3">
          <button
            onClick={createNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 transition-all hover:bg-white/10"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                activeId === conv.id
                  ? 'bg-purple-500/20 text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
              onClick={() => setActiveId(conv.id)}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{conv.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
                className="hidden shrink-0 rounded p-1 text-white/30 hover:bg-white/10 hover:text-red-400 group-hover:block"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <h1 className="text-lg font-semibold text-white">AI Chat</h1>
          </div>
          <ModelSelector value={model} onChange={setModel} className="w-56" />
        </div>

        {!hasApiKey && (
          <div className="px-4 pt-3">
            <ApiKeyWarning />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20"
              >
                <Sparkles className="h-8 w-8 text-purple-400" />
              </motion.div>
              <h2 className="mb-2 text-xl font-semibold text-white">How can I help you?</h2>
              <p className="max-w-md text-sm text-white/40">
                Start a conversation with AI. Ask questions, get creative, or explore ideas.
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              <AnimatePresence>
                {activeConversation.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`group relative max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-purple-600/30 text-white'
                          : 'bg-white/5 text-white/90'
                      }`}
                    >
                      {msg.role === 'assistant' && msg.content ? (
                        <MarkdownRenderer content={msg.content} />
                      ) : msg.role === 'assistant' && !msg.content && isStreaming ? (
                        <LoadingDots />
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}
                      {msg.content && (
                        <button
                          onClick={() => copyMessage(msg.content, msg.id)}
                          className="absolute -bottom-6 right-0 flex items-center gap-1 rounded px-2 py-0.5 text-xs text-white/30 opacity-0 transition-opacity hover:text-white/60 group-hover:opacity-100"
                        >
                          {copiedId === msg.id ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {copiedId === msg.id ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <User className="h-4 w-4 text-white/70" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/10 px-4 py-4">
          <div className="mx-auto flex max-w-3xl items-end gap-3">
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm transition-colors focus-within:border-purple-500/50">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="max-h-32 w-full resize-none bg-transparent text-white placeholder-white/30 focus:outline-none"
                style={{ minHeight: '24px' }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-white/20">
            {AI_MODELS.find((m) => m.id === model)?.name || 'AI'} · Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
