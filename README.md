# 🤖 Wir AI — AI Multi-Tool Hub

Your AI Swiss Army Knife. Chat, analyze images, generate code, summarize text, and translate — all in one beautiful interface.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4+-38bdf8?style=flat-square&logo=tailwindcss)

## ✨ Features

### 🗨️ AI Chat
- Real-time streaming responses (token by token)
- Multiple conversations with history
- Model selector (GPT-4o, Claude, Gemini, Llama, DeepSeek)
- Markdown rendering with code syntax highlighting
- Copy responses, clear conversations

### 👁️ Vision Analyzer
- Upload images or paste URLs
- AI-powered image analysis and description
- Drag & drop upload zone
- Custom analysis prompts

### 💻 Code Generator
- Describe what you need → get production-ready code
- 15+ programming languages supported
- Syntax highlighting with copy button
- "Explain this code" feature

### 📝 Summarizer
- Paste any text and get concise summaries
- Three formats: bullet points, paragraph, key takeaways
- Word count comparison (before/after)

### 🌐 Translator
- Translate between 22+ languages
- Swap languages with one click
- Preserves tone and formatting

### ⚙️ Settings
- API key management (stored locally)
- Default model selection
- Theme preferences

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenRouter API key ([Get one free](https://openrouter.ai/keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wir-ai.git
cd wir-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API key

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** Users can also enter their API key directly in the Settings page. The key is stored in localStorage (client-side only).

## 🏗️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **AI Provider:** OpenRouter API
- **Markdown:** react-markdown + remark-gfm
- **Code Highlighting:** react-syntax-highlighter

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # API routes (chat, vision, generate, summarize, translate)
│   ├── app/           # App pages (chat, vision, code, summarize, translate, settings)
│   ├── globals.css    # Global styles + animations
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Landing page
├── components/
│   ├── layout/        # Sidebar
│   └── ui/            # Reusable UI components
├── lib/               # Constants, settings, conversations
└── types/             # TypeScript type definitions
```

## 🎨 Design

- **Dark mode default** with deep purple/indigo primary and cyan accents
- **Glassmorphism** cards and panels
- **Smooth animations** powered by Framer Motion
- **Responsive** design — works on mobile and desktop
- **Animated gradient** background with floating particles

## 📄 License

MIT

---

Built with ❤️ by Wir
