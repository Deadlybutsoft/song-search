'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Sparkles, User, Search, Globe, Music } from 'lucide-react';
import { useConversation } from '@elevenlabs/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

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
        setSongResults(data.songs.slice(0, 2));
        // Auto-stop session after the AI announces the song (give it 8 seconds to speak)
        setTimeout(() => {
          try { conversation.endSession(); } catch (_) { }
        }, 8000);
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

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-black font-sans text-white overflow-hidden selection:bg-purple-500/30">

      <main className="flex-1 flex flex-col w-full px-3 py-4 gap-4">

        {/* Microphone Panel - Top on mobile (entire box is clickable) */}
        <div
          onClick={handleMicClick}
          className={`w-full shrink-0 border border-zinc-800 bg-white rounded-2xl p-4 flex flex-col items-center justify-center relative cursor-pointer transition-all duration-200 hover:bg-zinc-50 active:scale-[0.99] ${status === 'connecting' ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative flex items-center justify-center h-16 w-16 mb-2">
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
                  relative z-10 flex h-14 w-14 items-center justify-center rounded-full border transition-all duration-300
                  ${status === 'connected' ? 'border-purple-500/50 bg-white shadow-xl shadow-purple-900/20' : 'border-zinc-300 bg-white hover:bg-zinc-100'}
                  ${status === 'connecting' ? 'opacity-60 cursor-not-allowed border-zinc-200 bg-white' : ''}
                `}
              >
                {status === 'connecting' ? (
                  <Loader2 className="h-5 w-5 text-black animate-spin" strokeWidth={1.5} />
                ) : status === 'connected' ? (
                  <MicOff className="h-5 w-5 text-red-500" strokeWidth={1.5} />
                ) : (
                  <Mic className="h-5 w-5 text-black" strokeWidth={1.5} />
                )}
              </button>
            </div>

            <button
              onClick={handleMicClick}
              disabled={status === 'connecting'}
              className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-white text-black border border-zinc-200 hover:bg-zinc-100 transition-colors ${inter.className}`}
            >
              {status === 'connected' ? 'Tap to stop' : 'Tap to speak'}
            </button>
          </div>
        </div>

        {/* Transcript Panel */}
        <div className="flex-1 flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden min-h-0">
          <div className="border-b border-zinc-800 px-4 py-2 flex items-center justify-between bg-zinc-900/30 shrink-0">
            <h2 className="font-bold text-[10px] text-zinc-500 tracking-widest uppercase">Live Transcript</h2>
          </div>
          <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-xs gap-2 py-8">
                <Sparkles className="w-6 h-6 opacity-20" />
                <p className="font-medium">Waiting for conversation...</p>
              </div>
            )}
            {messages.map((m) => {
              if (m.source === 'system') {
                return (
                  <div key={m.id} className="flex justify-center">
                    <span className="inline-flex items-center gap-1 text-purple-400 bg-purple-500/10 border border-purple-500/20 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                      <Search className="w-2.5 h-2.5" /> {m.text}
                    </span>
                  </div>
                );
              }
              if (m.source === 'tool_result') {
                return (
                  <div key={m.id} className="w-full">
                    <div className="bg-zinc-950 rounded-xl p-3 text-[10px] font-mono text-zinc-500 whitespace-pre-wrap max-h-24 overflow-y-auto border border-zinc-800/50 scrollbar-thin">
                      <div className="flex items-center gap-1 font-sans font-bold text-purple-400 mb-1 text-[9px] uppercase tracking-widest">
                        <Globe className="w-3 h-3" /> Result
                      </div>
                      <div className="pl-2 border-l-2 border-zinc-800 leading-relaxed text-[11px]">{m.text}</div>
                    </div>
                  </div>
                );
              }
              const isUser = m.source === 'user';
              return (
                <div key={m.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[90%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isUser ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-900'}`}>
                      {isUser ? <User className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
                    </div>
                    <div className={`px-3 py-1.5 text-xs leading-relaxed ${isUser
                      ? 'bg-zinc-800 text-zinc-100 rounded-xl rounded-tr-sm'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl rounded-tl-sm'
                      }`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Song Results Panel */}
        <div className="flex-1 flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden min-h-0">
          <div className="border-b border-zinc-800 px-4 py-2 bg-zinc-900/30 shrink-0">
            <h2 className="font-bold text-[10px] text-zinc-500 tracking-widest uppercase">
              {songResults.length > 0 ? `${songResults.length} Songs` : 'Song Matches'}
            </h2>
          </div>
          <div className="p-3 flex-1 overflow-y-auto scrollbar-thin">
            {songResults.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs gap-2 py-6">
                <Music className="w-5 h-5 opacity-50" />
                <p className="font-medium">
                  {isSearching ? "Searching..." : "Songs appear here"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {songResults.map((song, i) => (
                  <a
                    key={i}
                    href={song.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-1 p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all duration-200 bg-zinc-950/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-xs text-zinc-100 leading-snug group-hover:text-purple-400 transition-colors">
                          {song.title}
                        </h3>
                        <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1 leading-relaxed">
                          {song.description || "No description"}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-purple-500/30">
                        <Music className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
