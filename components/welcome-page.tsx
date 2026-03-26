'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AudioLines, Mic2, Music } from 'lucide-react';

export function WelcomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/microphone');
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center bg-zinc-950 font-sans text-zinc-100 selection:bg-purple-500/30 overflow-hidden">

      {/* Main Content Card */}
      <div className="relative z-10 flex w-[90%] max-w-3xl flex-col items-center justify-center gap-10 text-center px-6 py-16 sm:py-24 rounded-[3rem] bg-zinc-900 border border-zinc-800 shadow-xl shadow-black/40">

        {/* Main Central Icon */}
        <div className="relative flex items-center justify-center h-28 w-28 rounded-full bg-zinc-950 shadow-inner border border-zinc-800 transition-transform duration-500 hover:scale-[1.03] gap-2">
          <AudioLines className="h-8 w-8 text-purple-400" strokeWidth={2} />
          <Music className="h-7 w-7 text-indigo-400" strokeWidth={2} />
        </div>

        {/* Heading & Subtext */}
        <div className="space-y-6 max-w-2xl px-4 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-zinc-800/40 border border-zinc-700/50 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
            <span>1. Sing</span>
            <span className="text-zinc-600">→</span>
            <span>2. Search</span>
            <span className="text-zinc-600">→</span>
            <span className="text-purple-400">3. Find</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-zinc-100 leading-tight">
            Find any song by singing the lyrics
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 font-medium leading-relaxed max-w-xl mx-auto">
            Got a melody stuck in your head? Just hum it, sing it, or say the lyrics you remember, and we'll instantly find the exact track for you.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button
            onClick={handleStart}
            size="lg"
            className="group relative h-16 rounded-full bg-zinc-100 px-10 text-lg font-bold text-zinc-900 transition-all duration-300 hover:scale-[1.02] hover:bg-white active:scale-[0.98] shadow-lg shadow-black/50"
          >
            <span className="relative z-10 flex items-center gap-2.5">
              Start Finding Now
              <Mic2 className="w-5 h-5 text-zinc-900" />
            </span>
          </Button>
        </div>
      </div>

    </div>
  );
}
