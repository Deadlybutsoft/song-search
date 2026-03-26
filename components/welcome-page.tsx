'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AudioLines, Mic2, Music } from 'lucide-react';
import { Instrument_Serif, Poppins } from 'next/font/google';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400']
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

export function WelcomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/microphone');
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center text-white bg-black font-sans selection:bg-purple-500/30 overflow-hidden px-4 py-6">

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center gap-6">

        {/* Main Central Icon */}
        <div className="relative flex items-center justify-center h-24 w-24 rounded-2xl bg-zinc-900/50 border border-zinc-800 transition-transform duration-500 hover:scale-[1.02]">
          <div className="flex items-center gap-1.5">
            <AudioLines className="h-7 w-7 text-purple-400" strokeWidth={2.5} />
            <Music className="h-6 w-6 text-indigo-400" strokeWidth={2.5} />
          </div>
        </div>

        {/* Heading & Subtext */}
        <div className="flex flex-col gap-3">
          <h1 className={`font-extrabold tracking-tight text-white leading-tight ${instrumentSerif.className}`} style={{ fontSize: '67px' }}>
            Find any song by singing its lyrics
          </h1>
          <p className={`font-medium ${poppins.className}`} style={{ fontSize: '20px', lineHeight: '1.4', color: 'white' }}>
            Got a melody stuck in your head? Just sing any part of the lyrics you remember and we'll instantly find the song for you.
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full flex flex-col" style={{ gap: '80px' }}>
          <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent w-full shadow-[0_0_10px_rgba(168,85,247,0.4)]" />
          <Button
            onClick={handleStart}
            size="lg"
            className={`group relative h-14 rounded-2xl bg-black px-8 text-base font-bold text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] hover:bg-white hover:text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] border-2 border-white/30 w-full ${poppins.className}`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-black">
              Start Finding Now
              <Mic2 className="w-5 h-5 text-white group-hover:text-black transition-colors" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
