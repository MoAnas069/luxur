"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function PrivateCatalogue() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { backgroundColor: "#F5F0E8" },
        {
          backgroundColor: "#FAF7F2",
          duration: 1.5,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "top 30%",
            scrub: true,
          },
        }
      );

      gsap.fromTo(
        ".reveal-text",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        ".access-panel",
        { y: 60, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-40 bg-lux-bg-ivory px-6 md:px-12 overflow-hidden group"
    >
      {/* Subtle Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Architectural Light Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/40 blur-[120px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[2000ms]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lux-gold/5 blur-[150px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[3000ms]" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left Side: Editorial Typography */}
        <div className="max-w-xl">
          <h2 className="reveal-text font-serif text-5xl md:text-7xl text-lux-dark leading-[1.1] mb-8">
            Curated Global <br />
            <span className="italic text-lux-gold">Luxury</span>{" "}
            Collections
          </h2>

          <p className="reveal-text font-serif text-2xl text-lux-dark mb-6">
            Explore curated catalogues sourced from premium manufacturers and
            design partners across the world.
          </p>

          <p className="reveal-text font-sans text-lux-text-muted font-light text-lg leading-relaxed mb-16">
            Refined furniture collections, bespoke pieces,
            luxury lighting, architectural finishes, and curated interior
            selections.
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-y-10 gap-x-8 border-t border-lux-border pt-12">
            {[
              { value: "30000+", label: "Curated Pieces" },
              { value: "Global", label: "Manufacturing Network" },
              { value: "Bespoke", label: "Luxury Collections" },
              { value: "Monthly", label: "Catalog Updates" },
            ].map((stat, idx) => (
              <div key={idx} className="reveal-text">
                <div className="font-serif text-3xl text-lux-dark mb-1">
                  {stat.value}
                </div>
                <div className="font-sans text-xs tracking-widest uppercase text-lux-gold font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Editorial Showcase Image */}
        <div className="access-panel relative h-[500px] md:h-[600px] w-full overflow-hidden border border-lux-border/60 rounded-sm">
          <Image
            src="/images/curated_collections.webp"
            alt="Curated Luxury Living Room"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-105"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-lux-dark/15 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
