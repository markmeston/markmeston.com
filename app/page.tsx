'use client';

import { useEffect, useRef } from 'react';

export default function HexWebCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    const startTime = Date.now();

    const render = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const elapsed = (Date.now() - startTime) / 1000;

      const buildProgress = Math.min(elapsed / 3, 1);
      const pulse = 0.7 + Math.sin(elapsed * 2) * 0.3;

      ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
      ctx.shadowBlur = 15 * pulse;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';

      const maxRadius = Math.min(cx, cy) * 0.8;
      const currentMaxRadius = maxRadius * buildProgress;
      const ringCount = 6;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3; 
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + currentMaxRadius * Math.cos(angle),
          cy + currentMaxRadius * Math.sin(angle)
        );
      }
      ctx.stroke();

      for (let ring = 1; ring <= ringCount; ring++) {
        const ringRadius = (maxRadius / ringCount) * ring;
        
        if (currentMaxRadius >= ringRadius) {
          ctx.beginPath();
          for (let i = 0; i <= 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = cx + ringRadius * Math.cos(angle);
            const y = cy + ringRadius * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <main className="bg-[#000000] min-h-screen w-full overflow-hidden flex items-center justify-center relative font-mono">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
      
      {/* S-Tier Digital Identity Card Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-lg">
        <div className="w-full bg-black/40 backdrop-blur-md border border-white/20 p-10 rounded-sm shadow-2xl flex flex-col gap-6">
          
          {/* Header Block */}
          <div className="flex flex-col gap-1 border-b border-white/20 pb-6">
            <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight uppercase">
              Mark Meston
            </h1>
            <p className="text-gray-400 text-sm md:text-base uppercase tracking-widest">
              L5 Software Engineer
            </p>
            <p className="text-gray-500 text-xs tracking-wider mt-1">
              Salt Lake City, UT
            </p>
          </div>

          {/* Comms Vector */}
          <div className="flex flex-col gap-3">
            <a 
              href="mailto:mark@markmeston.com" 
              className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-3"
            >
              <span className="text-white/50">EMAIL //</span> mark@markmeston.com
            </a>
            <a 
              href="https://linkedin.com/in/YOUR_LINKEDIN_SLUG" 
              target="_blank" 
              rel="noreferrer"
              className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-3"
            >
              <span className="text-white/50">NETWORK //</span> LinkedIn
            </a>
          </div>

          {/* Operational Gateway */}
          <div className="pt-4">
            <a 
              href="https://orbit.markmeston.com" // Update with the exact Orbit URL
              target="_blank"
              rel="noreferrer"
              className="group relative flex w-full items-center justify-center bg-white text-black py-4 px-6 text-sm font-bold uppercase tracking-widest overflow-hidden transition-all hover:bg-gray-200"
            >
              <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                Initialize Orbit Terminal
              </span>
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}