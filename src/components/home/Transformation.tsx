"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Transformation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightHalfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section and animate the split
      gsap.to(rightHalfRef.current, {
        clipPath: "inset(0 0 0 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1500",
          scrub: true,
          pin: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen bg-lux-dark overflow-hidden">
      {/* Left: Unfinished */}
      <div className="absolute inset-0">
        <img src="/images/the_canvas.webp" alt="The Canvas" className="w-full h-full object-cover filter grayscale opacity-50" />
        <div className="absolute inset-0 flex items-center p-12">
          <h2 className="text-white/50 font-serif text-4xl md:text-6xl">The Canvas</h2>
        </div>
      </div>

      {/* Right: Curated (revealed via clip-path) */}
      <div 
        ref={rightHalfRef} 
        className="absolute inset-0"
        style={{ clipPath: "inset(0 0 0 100%)" }}
      >
        <img src="/images/the_curation.webp" alt="The Curation" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-end p-12">
          <h2 className="text-white font-serif text-4xl md:text-6xl">The Curation</h2>
        </div>
      </div>
    </section>
  );
}
