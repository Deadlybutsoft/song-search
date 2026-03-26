# 🎵 Sound Search

A voice-powered song finder. Sing, hum, or say lyrics — and instantly find the exact track.

Built with **Next.js**, **ElevenLabs Conversational AI**, and **Firecrawl** web search.

## How It Works

1. **Tap the mic** and sing or say any lyrics you remember
2. The AI agent triggers a **real-time web search** via Firecrawl
3. Matching songs appear instantly with **title, artist, and links**

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework (Turbopack) |
| [ElevenLabs](https://elevenlabs.io/) | Voice AI agent (WebRTC streaming) |
| [Firecrawl](https://firecrawl.dev/) | Web search for lyrics matching |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Lucide Icons](https://lucide.dev/) | UI icons |

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Deadlybutsoft/song-search.git
cd song-search
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file:

```env
FIRECRAWL_API_KEY=your_firecrawl_api_key
```

### 4. Configure the ElevenLabs Agent

Follow the detailed setup instructions in [`ELEVENLABS_SETUP_GUIDE.md`](./ELEVENLABS_SETUP_GUIDE.md) to configure:
- System prompt
- First message
- `find_song` client tool with parameters
- Recommended tool settings

### 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/find-song/route.ts   # Firecrawl search API endpoint
│   ├── layout.tsx               # Root layout (Poppins font, dark mode)
│   ├── page.tsx                 # Home page
│   └── microphone/page.tsx      # Microphone workspace page
├── components/
│   ├── welcome-page.tsx         # Landing page UI
│   └── microphone-page.tsx      # Voice search interface
├── ELEVENLABS_SETUP_GUIDE.md    # Agent configuration guide
└── .env.local                   # API keys (not committed)
```

## Screenshots

### Home Page
Dark mode landing page with workflow badge and CTA button.

### Microphone Page
Grid layout with live transcript, song matches panel, and centered mic button.

## License

MIT
