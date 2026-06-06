"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface SourcingPanel {
  id: string;
  country: string;
  tagline: string;
  materials: string;
  image: string;
  mapPath: string; // SVG path or SVG custom node
  viewBox: string;
}

const panelsData: SourcingPanel[] = [
  {
    id: "vietnam",
    country: "Vietnam",
    tagline: "Woven Artistry & Fine Woods",
    materials: "Hand-crafted outdoor teak wood, custom woven rattan, and organic bamboo structures.",
    image: "/images/vietnam_sourcing.webp",
    // Clean S-curve representation of Vietnam
    mapPath: "M 48,25 C 44,28 35,32 37,38 C 39,44 48,46 47,52 C 46,58 35,62 38,68 C 41,74 45,82 43,88 C 41,94 36,97 34,103 C 32,109 38,114 36,120 C 34,126 26,132 29,138 C 32,144 43,150 40,158 C 37,166 27,172 31,178 C 35,184 46,189 42,196 C 38,203 26,209 29,216 C 32,223 41,228 38,236 C 35,244 23,249 28,256 C 33,263 46,268 44,276 C 42,284 31,291 36,298 C 41,305 52,311 49,319 C 46,327 33,334 38,342 C 43,350 56,354 53,363 C 50,372 39,379 43,387 C 47,395 59,400 56,408 C 53,416 41,424 45,432 C 49,440 60,443 62,450",
    viewBox: "0 0 100 480"
  },
  {
    id: "malaysia",
    country: "Malaysia",
    tagline: "Bespoke Hardwoods & Veneers",
    materials: "Premium tropical timber sourcing, fine high-end wood veneers, and custom cabinet millwork.",
    image: "/images/malaysia_sourcing.webp",
    // Two landmasses representing Malaysia (Peninsular + Borneo parts)
    mapPath: "M 15,28 C 12,30 8,35 11,40 C 14,45 22,48 20,53 C 18,58 12,62 14,68 C 16,74 25,78 28,82 C 31,86 32,92 35,95 C 38,98 42,94 45,90 C 48,86 47,78 44,72 C 41,66 36,60 38,55 C 40,50 48,45 46,40 C 44,35 34,32 31,28 C 28,24 23,22 18,25 Z M 65,55 C 60,58 56,65 59,70 C 62,75 70,72 75,76 C 80,80 82,88 88,85 C 94,82 98,72 95,66 C 92,60 84,54 80,50 C 76,46 70,52 65,55 Z",
    viewBox: "0 0 110 120"
  },
  {
    id: "china",
    country: "China",
    tagline: "Precision Metalwork & Fine Stoneware",
    materials: "Industrial grade custom steel structures, precision architectural metalwork, and premium porcelain and quartz.",
    image: "/images/china_sourcing.webp",
    // Clean outline of China map
    mapPath: "M 50,15 C 38,12 28,15 22,25 C 16,35 10,48 8,55 C 6,62 12,70 18,72 C 24,74 28,82 30,88 C 32,94 28,102 32,108 C 36,114 44,106 48,110 C 52,114 56,122 62,120 C 68,118 72,110 76,108 C 80,106 88,112 92,106 C 96,100 98,88 95,82 C 92,76 86,70 88,62 C 90,54 98,48 94,42 C 90,36 82,42 78,38 C 74,34 72,24 65,22 C 58,20 54,18 50,15 Z",
    viewBox: "0 0 110 135"
  },
  {
    id: "turkey",
    country: "Turkey",
    tagline: "Luxury Marbles & Textiles",
    materials: "World-famous Anatolian travertine, Carrara-grade block marble, and hand-woven luxury upholstery fabrics.",
    image: "/images/turkey_sourcing.webp",
    // Rectangular peninsula representing Turkey
    mapPath: "M 10,25 C 15,22 25,23 35,21 C 45,19 65,18 75,22 C 85,26 92,30 95,35 C 98,40 96,48 94,52 C 92,56 86,58 80,60 C 74,62 65,65 55,63 C 45,61 35,64 25,62 C 15,60 8,55 6,48 C 4,41 5,28 10,25 Z",
    viewBox: "0 0 110 80"
  }
];

export default function SourcingShowcase() {
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

  return (
    <section className="relative min-h-screen bg-lux-bg-alt flex flex-col justify-between py-24 px-6 md:px-12 overflow-hidden border-b border-lux-border/40">
      
      {/* Top Heading Section */}
      <div className="container mx-auto max-w-[1600px] mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <span className="uppercase tracking-[0.35em] text-[10px] text-lux-gold font-semibold mb-4 block">
            Global Supply Chain
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-lux-dark uppercase tracking-wide">
            Your Global Furniture <br /> Sourcing Partner
          </h2>
        </div>
        
        {/* Badge of Excellence */}
        <div className="flex items-center gap-4 border border-lux-gold/30 px-6 py-4 rounded-sm bg-white/40 backdrop-blur-md">
          <div className="text-right">
            <div className="text-[8px] uppercase tracking-[0.3em] text-lux-gold font-bold leading-tight">
              Curated Standards
            </div>
            <div className="font-serif text-sm text-lux-dark tracking-widest font-semibold uppercase">
              Of Excellence
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border border-lux-gold/30 flex items-center justify-center relative">
            {/* Elegant Sparkle Icon */}
            <svg className="w-4 h-4 text-lux-gold animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.2L22 10l-5.6 4.8L18.8 22 12 17.6 5.2 22l2.4-7.2L2 10l7.6-.8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Interactive Accordion Panels */}
      <div className="container mx-auto max-w-[1600px] flex-grow flex flex-col md:flex-row h-[65vh] md:h-[55vh] lg:h-[60vh] gap-4 w-full relative z-10 mb-8">
        {panelsData.map((panel) => {
          const isHovered = hoveredPanel === panel.id;
          const isAnyHovered = hoveredPanel !== null;
          
          // Class computation for width expansion
          const panelWidthClass = isHovered 
            ? "md:flex-[2.2] flex-[3]" 
            : isAnyHovered 
              ? "md:flex-[0.6] flex-[0.5]" 
              : "flex-1";

          return (
            <div
              key={panel.id}
              onMouseEnter={() => setHoveredPanel(panel.id)}
              onMouseLeave={() => setHoveredPanel(null)}
              className={`relative overflow-hidden transition-all duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] rounded-sm border border-lux-border/40 group flex flex-col justify-end p-8 md:p-10 ${panelWidthClass}`}
            >
              {/* Background Sourcing Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={panel.image}
                  alt={panel.country}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                  priority
                />
                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-lux-dark/85 via-lux-dark/45 to-lux-dark/10 transition-opacity duration-1000 group-hover:opacity-90" />
              </div>

              {/* Gold Floating Outline Map */}
              <div className={`absolute top-8 right-8 z-10 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isHovered ? "opacity-100 scale-110 rotate-3" : "opacity-35 scale-95 hover:opacity-75"
              }`}>
                <svg
                  viewBox={panel.viewBox}
                  className="w-16 h-16 md:w-24 md:h-24 stroke-lux-gold stroke-[1.2] fill-none drop-shadow-[0_0_15px_rgba(199,161,107,0.3)]"
                >
                  <path d={panel.mapPath} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Panel Content */}
              <div className="relative z-20 w-full flex flex-col justify-end text-white pointer-events-none">
                <span className="text-[10px] tracking-[0.3em] uppercase text-lux-gold font-bold mb-2">
                  Destination
                </span>
                
                <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-wider mb-4 transition-transform duration-700">
                  {panel.country}
                </h3>

                {/* Collapsible Info Block */}
                <div className={`overflow-hidden transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isHovered ? "max-h-[200px] opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}>
                  <p className="font-serif text-lg italic text-white/95 mb-2">
                    {panel.tagline}
                  </p>
                  <p className="font-sans text-xs md:text-sm text-white/70 font-light leading-relaxed mb-6 max-w-md">
                    {panel.materials}
                  </p>
                  
                  {/* Interactive Button (Pointer events auto to allow clicks) */}
                  <Link
                    href="/sourcing"
                    className="inline-flex items-center gap-3 py-3 border-b border-lux-gold/50 text-lux-gold text-[10px] tracking-[0.25em] uppercase font-semibold hover:border-lux-gold transition-colors duration-500 pointer-events-auto"
                  >
                    Discover Sourcing
                    <svg className="w-3.5 h-3.5 transform translate-x-0 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
