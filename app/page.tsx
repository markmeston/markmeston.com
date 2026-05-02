'use client';

import { useEffect, useRef } from 'react';

export default function MinimalHexCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    
    // Physics: Continuous single-point drawing vector
    let currentRing = 1;
    let currentSide = 0;
    let progress = 0; 
    const ringSpacing = 45; 
    const maxRings = 20;
    const drawSpeed = 0.08; 

    let cx = 0;
    let cy = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cx = canvas.width / 2;
      cy = canvas.height / 2;
    };
    window.addEventListener('resize', resize);
    resize();

    const getHexVertex = (ring: number, vertex: number) => {
      const angle = (vertex * Math.PI) / 3 - Math.PI / 6;
      const radius = ring * ringSpacing;
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle)
      };
    };

    const render = () => {
      // Absolute void background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render structural memory (previously drawn paths)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= currentRing; i++) {
         if (i < currentRing) {
           for(let j = 0; j <= 6; j++) {
              const pt = getHexVertex(i, j);
              if (j === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
           }
         }
      }
      ctx.stroke();

      // Render the active construction path
      if (currentRing <= maxRings) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#ffffff';
        ctx.lineWidth = 2;
        
        const startPt = getHexVertex(currentRing, 0);
        ctx.moveTo(startPt.x, startPt.y);
        
        for (let i = 0; i < currentSide; i++) {
           const pt = getHexVertex(currentRing, i + 1);
           ctx.lineTo(pt.x, pt.y);
        }
        
        const p1 = getHexVertex(currentRing, currentSide);
        const p2 = getHexVertex(currentRing, currentSide + 1);
        
        const currentX = p1.x + (p2.x - p1.x) * progress;
        const currentY = p1.y + (p2.y - p1.y) * progress;
        
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        // Active drawing head (kinetic core)
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Advance physics loop
        progress += drawSpeed;
        if (progress >= 1) {
          progress = 0;
          currentSide++;
          if (currentSide >= 6) {
            currentSide = 0;
            currentRing++;
          }
        }
      } else {
         // Loop the construct sequence seamlessly
         currentRing = 1;
         currentSide = 0;
         progress = 0;
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <main className="bg-[#000000] min-h-screen w-full overflow-hidden flex items-center justify-center relative font-mono selection:bg-white selection:text-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
      
      {/* Brutalist Identity Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 w-full max-w-sm">
        <div className="w-full border border-white/20 p-12 bg-black/60 backdrop-blur-md shadow-2xl flex flex-col gap-10 text-center transition-all hover:border-white/40">
          
          <div>
            <h1 className="text-white text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase">
              Mark Meston
            </h1>
          </div>

          <div className="flex flex-col gap-3 text-sm tracking-widest text-white/80">
            {/* INJECT YOUR PHONE NUMBER HERE */}
            <a href="tel:+10000000000" className="hover:text-white transition-colors">
              801.555.0199
            </a>
            <a href="mailto:mark@markmeston.com" className="hover:text-white transition-colors">
              MARK@MARKMESTON.COM
            </a>
          </div>

          <div className="pt-4">
            <a 
              href="https://orbit.markmeston.com" 
              target="_blank"
              rel="noreferrer"
              className="group relative flex w-full items-center justify-center bg-white text-black py-4 px-6 text-xs font-bold uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-gray-200"
            >
              <span className="relative z-10">
                Initialize Orbit
              </span>
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}