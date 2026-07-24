"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

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
            Private Access to <br />
            <span className="italic text-lux-gold">Global Luxury</span>{" "}
            Collections
          </h2>

          <p className="reveal-text font-serif text-2xl text-lux-dark mb-6">
            Explore curated catalogues sourced from premium manufacturers and
            design partners across the world.
          </p>

          <p className="reveal-text font-sans text-lux-text-muted font-light text-lg leading-relaxed mb-16">
            Exclusive access to refined furniture collections, bespoke pieces,
            luxury lighting, architectural finishes, and curated interior
            selections.
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-y-10 gap-x-8 border-t border-lux-border pt-12">
            {[
              { value: "5000+", label: "Curated Pieces" },
              { value: "Global", label: "Manufacturing Network" },
              { value: "Private", label: "Luxury Collections" },
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

        {/* Right Side: Access Panel — CTA */}
        <div className="access-panel relative">
          {/* Glass Panel Base */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] rounded-sm pointer-events-none" />

          {/* Inner Content */}
          <div className="relative p-12 md:p-16 min-h-[500px] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full border border-lux-gold/20 flex items-center justify-center mb-8">
              <Lock size={26} className="text-lux-gold" strokeWidth={1.5} />
            </div>

            <div className="uppercase tracking-[0.35em] text-[10px] text-lux-gold font-semibold mb-4">
              Invitation Only
            </div>

            <h3 className="font-serif text-3xl md:text-4xl text-lux-dark mb-5 leading-tight">
              Private Catalogue <br />
              <span className="italic text-lux-gold">Access</span>
            </h3>

            <p className="font-sans font-light text-lux-text-muted text-base leading-relaxed max-w-sm mx-auto mb-10">
              Our curated luxury catalogues are available exclusively to
              verified clients. Request access to browse our complete magazine
              collection.
            </p>

            <Link
              href="/private-access"
              className="w-full max-w-xs py-5 bg-lux-dark text-white uppercase tracking-[0.2em] text-[11px] font-semibold relative overflow-hidden group/btn flex items-center justify-center gap-3 rounded-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-lux-gold-deep via-lux-gold to-lux-gold-deep opacity-0 group-hover/btn:opacity-100 transition-opacity duration-1000" />
              <span className="relative z-10">Request Private Access</span>
              <ArrowRight
                size={14}
                className="relative z-10 group-hover/btn:translate-x-1 transition-transform"
              />
            </Link>

            <p className="text-[10px] text-lux-text-muted/40 mt-6 tracking-wider font-sans">
              Verified access • Non-downloadable viewing
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
