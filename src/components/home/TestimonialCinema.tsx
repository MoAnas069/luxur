"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialCinema() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".quote", 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );

      // Subtle cinematic panning
      gsap.to(".bg-image", {
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen bg-lux-dark overflow-hidden flex items-center justify-center">
      <img 
        src="/images/dubai_landscape.webp" 
        alt="Dubai Landscape" 
        className="bg-image absolute inset-0 w-full h-full object-cover opacity-40" 
      />
      <div className="absolute inset-0 bg-lux-dark/60" />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <p className="quote font-serif text-3xl md:text-5xl text-white leading-snug mb-10">
          "They did not just furnish our home; they established its soul. The level of global access and restraint is unmatched."
        </p>
        <p className="quote text-lux-gold uppercase tracking-widest text-sm font-semibold">
          — Kevin, UAE
        </p>
      </div>
    </section>
  );
}
