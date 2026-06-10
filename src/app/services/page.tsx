"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Box, Edit3, Grid, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const servicesList = [
  {
    step: "01",
    title: "3D Design",
    caption: "Photorealistic Interior Visualization",
    image: "/images/service_3d_design.webp",
    icon: Box,
  },
  {
    step: "02",
    title: "2D Design",
    caption: "Technical Drawing & Concept Layouts",
    image: "/images/service_2d_design.webp",
    icon: Edit3,
  },
  {
    step: "03",
    title: "Floor Plan Design",
    caption: "Space Planning & Functional Layouts",
    image: "/images/service_floor_plan.webp",
    icon: Grid,
  },
  {
    step: "04",
    title: "Virtual Reality Design",
    caption: "Immersive Design Experience",
    image: "/images/service_vr_design.webp",
    // Custom VR Headset SVG rendering handler
    customIcon: (
      <svg className="w-6 h-6 text-lux-gold transition-transform duration-500 group-hover/card:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M 3,8 C 3,7 4,6 5,6 L 19,6 C 20,6 21,7 21,8 L 21,15 C 21,16 20,17 19,17 L 15,17 C 14.5,17 14,16.5 13.5,16 C 13,15.5 11,15.5 10.5,16 C 10,16.5 9.5,17 9,17 L 5,17 C 4,17 3,16 3,15 Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="11.5" r="1" fill="currentColor" />
        <circle cx="17" cy="11.5" r="1" fill="currentColor" />
        <path d="M 9,6 Q 12,4 15,6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    step: "05",
    title: "Global Interior Designers",
    caption: "Expert Designers From Around The World",
    image: "/images/service_global_designers.webp",
    icon: Globe,
  }
];



export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-text", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", stagger: 0.2 }
      );

      gsap.fromTo(".service-column-card", 
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-column-grid",
            start: "top 85%",
          },
        }
      );


    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-36 pb-32 bg-lux-bg-ivory px-4 md:px-10 overflow-hidden min-h-screen">
      {/* Subtle Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Hero Header */}
      <div className="mb-24 text-center max-w-4xl mx-auto relative z-10">
        <span className="hero-text uppercase tracking-[0.35em] text-[10px] text-lux-gold font-semibold mb-4 block">
          Our Specializations
        </span>
        <h1 className="hero-text text-5xl md:text-7xl font-serif text-lux-dark leading-tight tracking-tight">
          Architectural Interior <br className="hidden md:block"/> Curation Services
        </h1>
        <p className="hero-text mt-6 text-lg font-sans text-lux-text-muted font-light max-w-2xl mx-auto leading-relaxed">
          From precise digital drafting to immersive VR walkthroughs and global designer networks, we outline and compose every details of your space.
        </p>
      </div>

      {/* 5-Column Services Grid */}
      <div className="services-column-grid max-w-[1700px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-44 relative z-10">
        {servicesList.map((item) => (
          <div
            key={item.step}
            className="service-column-card group/card bg-white border border-lux-border p-6 flex flex-col justify-between items-center text-center transition-all duration-700 hover:border-lux-gold/60 hover:shadow-[0_20px_50px_-20px_rgba(199,161,107,0.12)] rounded-sm"
          >
            {/* Header Circle Icon */}
            <div className="w-16 h-16 rounded-full border border-lux-gold/20 flex items-center justify-center mb-6 bg-lux-bg-alt/30 transition-colors duration-500 group-hover/card:border-lux-gold/45">
              {item.customIcon ? (
                item.customIcon
              ) : (
                item.icon && (
                  <item.icon className="w-6 h-6 text-lux-gold transition-transform duration-500 group-hover/card:scale-110" strokeWidth={1.2} />
                )
              )}
            </div>

            {/* Number and Title */}
            <div className="mb-4">
              <span className="text-lux-gold font-serif text-xs tracking-[0.25em] block mb-1">
                {item.step}
              </span>
              <h3 className="font-serif text-xl uppercase tracking-widest text-lux-dark font-semibold">
                {item.title}
              </h3>
              {/* Gold Flourish Divider */}
              <div className="w-8 h-[1px] bg-lux-gold/30 mx-auto mt-3 transition-all duration-500 group-hover/card:w-16 group-hover/card:bg-lux-gold/60"></div>
            </div>

            {/* Image Box */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-lux-bg mb-6 mt-4 border border-lux-border/40 rounded-sm">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover transition-transform duration-1000 group-hover/card:scale-103"
              />
              <div className="absolute inset-0 bg-lux-dark/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
            </div>

            {/* Sub-caption at bottom */}
            <div className="flex items-center gap-2 mt-auto">
              {/* Small Gold Icon matching reference details */}
              <svg className="w-3.5 h-3.5 text-lux-gold opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" />
              </svg>
              <span className="font-sans text-[10px] uppercase tracking-widest text-lux-text-muted/80 leading-normal font-semibold">
                {item.caption}
              </span>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}
