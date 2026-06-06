"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function HeroScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  const frameCount = 192;
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let isMobile = window.innerWidth <= 768;

    const images: HTMLImageElement[] = [];
    const airpods = { frame: 1 };

    const render = () => {
      let img = images[airpods.frame - 1];
      
      // Fallback to nearest loaded frame backward if the targeted frame is still downloading
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = airpods.frame - 1; i >= 0; i--) {
          if (images[i] && images[i].complete && images[i].naturalWidth !== 0) {
            img = images[i];
            break;
          }
        }
      }

      if (img && img.complete && img.naturalWidth !== 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        // Watermark already cropped from raw WebP files, no additional crop needed
        const cropBottomRatio = 0; 
        const sWidth = img.width;
        const sHeight = img.height * (1 - cropBottomRatio);

        // Scale to cover the entire viewport (behaving like CSS 'object-fit: cover')
        const scale = Math.max(canvas.width / sWidth, canvas.height / sHeight);
        
        // Center it perfectly both horizontally and vertically
        const dx = (canvas.width - (sWidth * scale)) / 2; 
        const dy = (canvas.height - (sHeight * scale)) / 2;

        context.drawImage(
          img,
          0,
          0,
          sWidth,
          sHeight,
          dx,
          dy,
          sWidth * scale,
          sHeight * scale
        );
      }
    };

    const loadImages = () => {
      images.length = 0;
      setLoaded(false);
      const folder = isMobile ? "luxfurphone" : "luxfurdesk";

      // 1. Load the first frame immediately for instant LCP render
      const firstImg = new Image();
      firstImg.src = `/${folder}/frame_0001.webp`;
      firstImg.onload = () => {
        images[0] = firstImg;
        render();
        
        // 2. Defer bulk frames download to prevent network choking on mount
        setTimeout(() => {
          loadRemaining(folder);
        }, 1200);
      };
      images.push(firstImg);

      // Pre-allocate placeholders
      for (let i = 2; i <= frameCount; i++) {
        images.push(null as any);
      }

      function loadRemaining(folderName: string) {
        let loadedRest = 1;
        const batchSize = 10;
        let currentIndex = 2;

        function loadNextBatch() {
          if (currentIndex > frameCount) return;
          const limit = Math.min(currentIndex + batchSize - 1, frameCount);
          
          for (let i = currentIndex; i <= limit; i++) {
            const img = new Image();
            img.src = `/${folderName}/frame_${String(i).padStart(4, "0")}.webp`;
            img.onload = () => {
              images[i - 1] = img;
              loadedRest++;
              if (loadedRest === 10 || loadedRest === 50 || loadedRest === 100 || loadedRest === frameCount) {
                render();
              }
              if (loadedRest === frameCount) {
                setLoaded(true);
              }
            };
            img.onerror = () => {
              loadedRest++;
              if (loadedRest === frameCount) {
                setLoaded(true);
              }
            };
          }
          
          currentIndex += batchSize;
          setTimeout(loadNextBatch, 80);
        }

        loadNextBatch();
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== isMobile || images.length === 0) {
        isMobile = newIsMobile;
        loadImages();
      } else {
        render();
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Initialize canvas size and load images

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=7000",
        scrub: 0.5,
        pin: true,
      },
    });

    // We have 4000 total distance. Let's use relative durations in the timeline.
    // Let total duration be 4. 
    // frame animation: 0 to 3 (which corresponds to 3000px)
    tl.to(
      airpods,
      {
        frame: frameCount,
        snap: "frame",
        ease: "none",
        duration: 3,
        onUpdate: render,
      },
      0
    );

    // Sequence 1: 0-15% -> opacity 1 at 300px (0.3), opacity 0 at 600px (0.6)
    tl.fromTo(
      "#hero-text-1",
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "none" },
      0
    );
    tl.to("#hero-text-1", { opacity: 0, duration: 0.3, ease: "none" }, 0.3);

    // Sequence 2: 15-35% -> opacity 1 at 900px (0.9), opacity 0 at 1200px (1.2)
    tl.fromTo(
      "#hero-text-2",
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "none" },
      0.6
    );
    tl.to("#hero-text-2", { opacity: 0, duration: 0.3, ease: "none" }, 0.9);

    // Final Reveal: opacity 1 at 2800px (2.8). Starts at 2.4.
    tl.fromTo(
      "#hero-final",
      { opacity: 0, y: 30, pointerEvents: "none" },
      { opacity: 1, y: 0, pointerEvents: "auto", ease: "power3.out", duration: 0.4 },
      2.4
    );

    // Add empty space to ensure the timeline lasts exactly 4 seconds
    tl.to({}, { duration: 1 }, 3);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen bg-lux-dark overflow-hidden flex items-center justify-center">
      {/* Cinematic Logo Intro */}
      <div 
        className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-lux-dark transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${loaded ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'}`}
      >
        <div className={`flex flex-col items-center ${loaded ? '' : 'animate-logo-rise'}`}>
          <span className="text-white font-serif text-5xl md:text-7xl lg:text-8xl tracking-[0.35em] uppercase">
            Luxura
          </span>
          <div className="w-16 h-[1px] bg-lux-gold/60 mt-6 animate-line-expand"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes logoRise {
          0% { opacity: 0; transform: translateY(40px); }
          40% { opacity: 1; transform: translateY(0); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineExpand {
          0% { width: 0; opacity: 0; }
          50% { width: 0; opacity: 0; }
          70% { width: 64px; opacity: 0.6; }
          100% { width: 64px; opacity: 0.6; }
        }
        .animate-logo-rise { animation: logoRise 2s ease-out forwards; }
        .animate-line-expand { animation: lineExpand 2.4s ease-out forwards; }
      `}</style>

      <div className="absolute inset-0 w-full h-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: loaded ? 1 : 0 }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full h-full">
          
          {/* Phase 1 Text */}
          <div id="hero-text-1" className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none px-4">
            <h2 className="text-white font-serif text-3xl md:text-6xl tracking-wide font-light">
              Luxury begins in atmosphere.
            </h2>
          </div>

          {/* Phase 2 Text */}
          <div id="hero-text-2" className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none px-4">
            <h2 className="text-white font-serif text-3xl md:text-6xl tracking-wide font-light">
              Composed through light.
            </h2>
          </div>

          {/* Final Text */}
          <div id="hero-final" className="absolute inset-0 flex flex-col items-center justify-center opacity-0 pointer-events-none px-4 mt-12 md:mt-0">
            <h1 className="text-white font-serif text-4xl md:text-7xl lg:text-8xl tracking-wide mb-8 md:mb-10 leading-tight">
              Luxury, Composed <br className="hidden md:block"/> with Intention.
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto px-6 sm:px-0">
              <Link href="/collections" className="w-full sm:w-auto">
                <button className="w-full px-6 py-4 bg-lux-gold text-white tracking-widest uppercase text-xs md:text-sm hover:bg-lux-gold-deep transition-colors duration-500">
                  Explore Collections
                </button>
              </Link>
              <button 
                onClick={() => {
                  const target = document.getElementById("contact-section");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/#contact-section";
                  }
                }}
                className="w-full sm:w-auto px-6 py-4 bg-transparent border border-white/30 text-white tracking-widest uppercase text-xs md:text-sm hover:bg-white/10 transition-colors duration-500"
              >
                Begin Your Project
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
