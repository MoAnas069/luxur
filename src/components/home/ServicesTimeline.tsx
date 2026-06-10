"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const timelineSteps = [
  {
    step: "01",
    title: "Consultation & Briefing",
    desc: "We align on your architectural layout, aesthetic goals, and functional needs to design a custom roadmap for your space.",
    detail: "Material palettes, mood boarding, and timeline projection."
  },
  {
    step: "02",
    title: "Global Curation",
    desc: "Accessing our network of international designers and master ateliers to curate exclusive, cohesive collections.",
    detail: "Veneers, custom fabrics, and rare stone sourcing."
  },
  {
    step: "03",
    title: "Sourcing & Quality Checks",
    desc: "Overseeing procurement, custom carpentry, and manufacturing with local verification teams at each workshop.",
    detail: "Structural tolerances, moisture verification, and finish checks."
  },
  {
    step: "04",
    title: "White-Glove Installation",
    desc: "From port logistics to your room, our curators handle delivery, assembly, and precise final styling.",
    detail: "Custom packaging, assembly, and turnkey execution."
  }
];

export default function ServicesTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftStickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in timeline cards sequentially
      gsap.fromTo(
        ".timeline-card",
        { y: 50, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".timeline-flow",
            start: "top 80%",
          }
        }
      );

      // Parallax effect on the architectural blueprint image
      gsap.to(".blueprint-img", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-20 md:py-48 bg-[#FAF8F3] px-6 md:px-12 border-t border-lux-border/40">
      {/* Subtle Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start relative z-10">
        
        {/* Left Side: Sticky Process Architecture & Image (5 Cols) */}
        <div ref={leftStickyRef} className="lg:col-span-5 lg:sticky lg:top-32 space-y-12">
          <div>
            <span className="uppercase tracking-[0.35em] text-[10px] text-lux-gold font-semibold mb-4 block">
              Behind the Scenes
            </span>
            <h2 className="font-serif text-4xl md:text-7xl text-lux-dark leading-none mb-6">
              Architecting <br />
              <span className="italic font-light text-lux-gold">The Process</span>
            </h2>
            <p className="font-sans text-lux-text-muted font-light text-lg leading-relaxed max-w-md">
              A bespoke, client-centric timeline structured to ensure flawless global execution from block stone selection to in-room staging.
            </p>
          </div>

          {/* Blueprint/Floor Plan Graphic Frame */}
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-lux-border/60 bg-lux-dark shadow-sm rounded-sm group">
            <div className="blueprint-img absolute inset-0 w-full h-[110%] -top-[5%]">
              <Image
                src="/images/arch.webp"
                alt="Architectural Floor Plan Blueprint"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-[2000ms] group-hover:scale-[1.03]"
              />
            </div>
            {/* Elegant overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-lux-dark/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Blueprint label */}
            <div className="absolute bottom-6 left-6 text-white">
              <span className="text-[9px] uppercase tracking-widest text-lux-gold font-semibold block mb-1">
                Atelier Spec Sheet
              </span>
              <span className="text-xs font-sans font-light text-white/70">
                Workspace & Layout Composition
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline Cards (7 Cols) */}
        <div className="lg:col-span-7 timeline-flow space-y-8 relative pl-4 md:pl-8 border-l border-lux-border/60">
          
          {timelineSteps.map((step) => (
            <div 
              key={step.step}
              className="timeline-card group bg-white border border-lux-border/40 p-6 md:p-10 rounded-sm shadow-[0_4px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_50px_rgba(156,122,60,0.06)] hover:border-lux-gold/30 transition-all duration-700 relative"
            >
              {/* Bullet Node */}
              <div className="absolute -left-[21px] md:-left-[37px] top-10 w-2.5 h-2.5 rounded-full bg-white border-2 border-lux-gold transition-transform duration-500 group-hover:scale-125" />

              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6">
                <h3 className="font-serif text-2xl md:text-3xl text-lux-dark group-hover:text-lux-gold transition-colors duration-500">
                  {step.title}
                </h3>
                <span className="font-serif text-lux-gold text-4xl font-light tracking-widest">
                  {step.step}
                </span>
              </div>

              <p className="font-sans text-sm md:text-base text-lux-text-muted font-light leading-relaxed mb-6">
                {step.desc}
              </p>

              <div className="border-t border-lux-border/40 pt-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-lux-gold font-semibold">
                  Deliverables
                </span>
                <span className="text-[10px] font-sans text-lux-text-muted/60 font-medium">
                  {step.detail}
                </span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
