# 📝 GPT Blog Generator

An AI-powered blog generator built with **Next.js 14**, **Tailwind CSS**, and **OpenRouter's GPT API (DeepSeek)**. Enter a topic, and get a full-length, SEO-friendly blog post with headings, structured content, and formatting — instantly.

## ✨ Features

* ⚡ Generate full blogs with GPT using DeepSeek
* 🌟 SEO-friendly with proper H1/H2 structure
* 💬 Smooth typing animation for output display
* 🌃 Light & Dark Mode toggle
* 📱 Fully responsive for mobile and desktop
* ✅ Clean UI/UX built with Tailwind CSS
* 🔐 API error handling with fallback messaging

## 📸 Preview

&#x20;

## 🚀 Live Demo

👉 [https://ai-blog-generator-hazel.vercel.app](https://ai-blog-generator-hazel.vercel.app)

## 🛠️ Stack

* **Framework**: Next.js 14 (App Router)
* **Styling**: Tailwind CSS
* **AI Model**: `deepseek/deepseek-chat` via [OpenRouter](https://openrouter.ai/)
* **Deployment**: Vercel

## 🧠 Prompting Strategy

The system prompt used:

> "You are a professional blog writer. Use H2 headings, concise paragraphs, bullet points when helpful, and clear formatting. End with a strong conclusion."

## 🧪 Local Development

```bash
git clone https://github.com/your-username/blog-generator.git
cd blog-generator
npm install
```

### Create `.env.local`

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Run Locally

```bash
npm run dev
```

## 📦 Deployment

* Push code to GitHub
* Import the repo on [Vercel](https://vercel.com/import)
* Add the environment variable `OPENROUTER_API_KEY`
* Deploy!

## 📄 License

MIT License © 2025 [Shaunak Mishra](https://github.com/ShaunakMishra25)
