'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Loader2, Sparkles, User, Search, Globe, Music } from 'lucide-react';
import { useConversation } from '@elevenlabs/react';

type Message = {
  id: string;
  source: 'ai' | 'user' | 'system' | 'tool_result';
  text: string;
};

type SongResult = {
  title: string;
  description: string;
  url: string;
};

export function MicrophonePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [songResults, setSongResults] = useState<SongResult[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleFindSong(parameters: any) {
    const lyricsQuery = typeof parameters === 'string'
      ? parameters
      : (parameters?.lyrics || parameters?.query || "unknown lyrics");

    console.log("--- TOOL TRIGGERED ---");
    console.log("Lyrics:", lyricsQuery);

    setIsSearching(true);
    setSongResults([]);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      source: 'system',
      text: `Searching web for: "${lyricsQuery}"`
    }]);

    try {
      const res = await fetch('/api/find-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: lyricsQuery })
      });

      const data = await res.json();
      console.log("API response:", data);

      setIsSearching(false);

      if (data.songs && data.songs.length > 0) {
        setSongResults(data.songs);
      }

      const rawResult = data.result || data.error || "No results found.";

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        source: 'tool_result',
        text: rawResult
      }]);

      return rawResult;
    } catch (e: any) {
      setIsSearching(false);
      console.error("Tool error:", e);
      return "Search failed: " + (e?.message || "unknown error");
    }
  }

  const conversation = useConversation({
    onConnect: () => console.log('Agent connected'),
    onDisconnect: () => console.log('Agent disconnected'),
    onError: (error: any) => console.error('Agent error:', error),
    onMessage: (msg: any) => {
      if (msg.message && msg.message.trim() !== "") {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + Math.random(),
          source: msg.source,
          text: msg.message
        }]);
      }
    },
    clientTools: {
      find_song: async (params: any) => handleFindSong(params),
      find_tool: async (params: any) => handleFindSong(params),
      tool_1401kmm257xaet9rp03n6k64xq2j: async (params: any) => handleFindSong(params),
    }
  });

  const { status, isSpeaking } = conversation;

  const handleMicClick = useCallback(async () => {
    if (status === 'connected') {
      await conversation.endSession();
      // Keep transcript and song results visible after stopping
    } else {
      try {
        // Only clear when starting a brand new session
        setMessages([]);
        setSongResults([]);
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation.startSession({
          agentId: 'agent_0901kmm0thpmf78sajrcfmc2hr8r',
          connectionType: 'webrtc',
        });
      } catch (err: any) {
        console.warn('Microphone session warning:', err.message);
        if (err.name === 'NotFoundError' || err.message?.includes('device not found')) {
          alert('No microphone detected! Please connect or enable a microphone on your device to use this feature.');
        } else if (err.name === 'NotAllowedError' || err.message?.includes('Permission')) {
          alert('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else {
          alert('Could not access microphone: ' + (err.message || 'Unknown error.'));
        }
      }
    }
  }, [status, conversation]);

  const handleBack = () => {
    if (status === 'connected') conversation.endSession();
    router.push('/');
  };

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-zinc-950 font-sans text-zinc-100 overflow-hidden selection:bg-purple-500/30">
      <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-0" />

      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 z-10 pt-8 pb-4 gap-6 min-h-0">

        {/* TOP ROW: Transcript & Song Matches */}
        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-[300px]">

          {/* Transcript Panel (Top Left) */}
          <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl shadow-black/40 overflow-hidden min-h-0">
            <div className="border-b border-zinc-800 px-5 py-3 flex items-center justify-between bg-zinc-900/50 shrink-0">
              <h2 className="font-bold text-[11px] text-zinc-500 tracking-widest uppercase">Live Transcript</h2>
              {isSearching && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full animate-pulse border border-purple-500/20">
                  <Search className="w-3 h-3" /> Firecrawl Active
                </div>
              )}
            </div>
            <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-sm gap-3 py-16">
                  <Sparkles className="w-8 h-8 opacity-20" />
                  <p className="font-medium">Waiting for conversation...</p>
                </div>
              )}
              {messages.map((m) => {
                if (m.source === 'system') {
                  return (
                    <div key={m.id} className="flex justify-center">
                      <span className="inline-flex items-center gap-1.5 text-purple-400 bg-purple-500/10 border border-purple-500/20 text-[11px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                        <Search className="w-3 h-3" /> {m.text}
                      </span>
                    </div>
                  );
                }
                if (m.source === 'tool_result') {
                  return (
                    <div key={m.id} className="w-full">
                      <div className="bg-zinc-950 rounded-2xl p-4 text-[11px] font-mono text-zinc-500 whitespace-pre-wrap max-h-40 overflow-y-auto border border-zinc-800/50 shadow-inner">
                        <div className="flex items-center gap-1.5 font-sans font-bold text-purple-400 mb-2 text-[10px] uppercase tracking-widest">
                          <Globe className="w-3.5 h-3.5" /> Firecrawl Response
                        </div>
                        <div className="pl-3 border-l-2 border-zinc-800 leading-relaxed">{m.text}</div>
                      </div>
                    </div>
                  );
                }
                const isUser = m.source === 'user';
                return (
                  <div key={m.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2.5 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${isUser ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-900'}`}>
                        {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                      </div>
                      <div className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${isUser
                        ? 'bg-zinc-800 text-zinc-100 rounded-2xl rounded-tr-sm border border-zinc-700/50'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-2xl rounded-tl-sm'
                        }`}>
                        {m.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Song Results Panel (Top Right) */}
          <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl shadow-black/40 overflow-hidden min-h-0">
            <div className="border-b border-zinc-800 px-5 py-3 bg-zinc-900/50 shrink-0">
              <h2 className="font-bold text-[11px] text-zinc-500 tracking-widest uppercase">
                {songResults.length > 0 ? `${songResults.length} Matching Songs Found` : 'Song Matches'}
              </h2>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              {songResults.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-sm gap-3">
                  <div className="p-2.5 rounded-full bg-zinc-800 border border-zinc-700/50 shadow-sm">
                    <Music className="w-5 h-5 text-zinc-400 opacity-80" />
                  </div>
                  <p className="font-medium">
                    {isSearching ? "Searching for songs..." : "Songs will appear here after search"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {songResults.map((song, i) => (
                    <a
                      key={i}
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col gap-2 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-200 bg-zinc-950/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-[15px] text-zinc-100 leading-snug group-hover:text-purple-400 transition-colors">
                            {song.title}
                          </h3>
                          <p className="text-sm text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                            {song.description || "No description available"}
                          </p>
                        </div>
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all shadow-sm relative overflow-hidden">
                          <Music className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors group-hover:scale-110 duration-300 z-10" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: Microphone Panel */}
        <div className="w-full shrink-0 border border-zinc-800 bg-zinc-900 rounded-3xl p-6 shadow-xl shadow-black/40 flex flex-col items-center justify-center relative min-h-[180px] sm:min-h-[220px]">

          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <h1 className="text-sm font-bold tracking-tight text-zinc-100">
              {status === 'connected'
                ? (isSearching ? 'Search In Progress...' : isSpeaking ? 'Speaking...' : 'Listening...')
                : status === 'connecting'
                  ? 'Connecting...'
                  : 'Ready'}
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center mt-8 w-full">
            <div className="relative flex items-center justify-center h-24 w-24 sm:h-28 sm:w-28 mb-3">
              {status === 'connected' && !isSpeaking && !isSearching && (
                <div className="absolute inset-0 animate-ping rounded-full bg-purple-500/20" style={{ animationDuration: '2.5s' }} />
              )}
              {isSearching && (
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-purple-500" style={{ animationDuration: '1s' }} />
              )}
              <button
                onClick={handleMicClick}
                disabled={status === 'connecting'}
                className={`
                  relative z-10 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border transition-all duration-300
                  ${status === 'connected' ? 'border-purple-500/50 bg-zinc-950 shadow-xl shadow-purple-900/20 scale-105' : 'border-zinc-700 bg-zinc-950 hover:bg-zinc-800 hover:shadow-lg'}
                  ${status === 'connecting' ? 'opacity-60 cursor-not-allowed border-zinc-800 bg-zinc-950' : ''}
                `}
              >
                {status === 'connecting' ? (
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-100 animate-spin" strokeWidth={1.5} />
                ) : status === 'connected' ? (
                  <MicOff className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" strokeWidth={1.5} />
                ) : (
                  <Mic className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-300" strokeWidth={1.5} />
                )}
              </button>
            </div>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              {status === 'connected' ? 'Tap to stop' : 'Tap to speak'}
            </p>

            {/* Equalizer slowly floating near the bottom */}
            <div className="absolute bottom-5 h-6 flex items-center justify-center gap-1.5 w-full">
              {isSpeaking && [...Array(7)].map((_, i) => (
                <div key={i} className="w-1 rounded-full bg-purple-500 animate-pulse"
                  style={{
                    height: `${8 + Math.random() * 12}px`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '0.4s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </main>

      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50">
        <Button
          onClick={handleBack}
          className="rounded-full px-8 h-12 bg-black border border-zinc-800 text-white hover:bg-zinc-900 hover:text-white shadow-xl shadow-black/30 text-xs tracking-widest uppercase font-bold transition-all hover:scale-105"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
