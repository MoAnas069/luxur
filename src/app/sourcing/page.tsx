"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Compass, ShieldCheck, Sparkles, Anchor, Trees, Layers, Gem } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const sourcingDetails = [
  {
    country: "Vietnam",
    tagline: "Natural Rattan & Hardwood Craftsmanship",
    desc: "In the quiet coastal provinces, local master weavers and wood artisans utilize centuries-old techniques. We source hand-woven rattan fibers and sustainably harvested teak wood that withstand environmental wear while exuding organic luxury.",
    icon: Trees,
    materials: ["Premium Teak Wood", "Natural Rattan weaving", "Acre-grade Bamboo structure"],
    image: "/images/vietnam_sourcing.webp"
  },
  {
    country: "Malaysia",
    tagline: "High-End Hardwoods & Exotic Veneers",
    desc: "Famous for dense tropical forests and state-of-the-art timber engineering, our Malaysian partners produce clean-cut veneer surfaces and engineered cores that prevent warping under climate shifts. Ideal for premium credenzas and custom architectural paneling.",
    icon: Layers,
    materials: ["Tropical Hardwoods", "Fine Walnut & Oak Veneers", "Engineered Structural Cores"],
    image: "/images/malaysia_sourcing.webp"
  },
  {
    country: "China",
    tagline: "State-of-the-Art Metalwork & Technical Stoneware",
    desc: "In Shenzhen and Guangdong architectural manufacturing zones, we source laser-precise metal frames, custom brass fixtures, and premium large-format sintered stone slabs that achieve high-gloss, ultra-durable luxury finishes.",
    icon: Gem,
    materials: ["Integrated LED Components", "Precision Steel & Brass castings", "Large-Format Sintered Stone"],
    image: "/images/china_sourcing.webp"
  },
  {
    country: "Turkey",
    tagline: "Elite Anatolian Marble & Upholstery Fabrics",
    desc: "Procured from heritage quarries in central Anatolia and textile mills in Istanbul, Turkish marble offers distinct, rich veining and textures. Coupled with hand-woven jacquard and chenille upholstery fabrics, Turkey represents the classical luxury core.",
    icon: Anchor,
    materials: ["Travertine & Carrara-grade Marble", "Luxury Chenille & Velvet fabrics", "Hand-tufted upholstery"],
    image: "/images/turkey_sourcing.webp"
  }
];

const procurementProcess = [
  { step: "01", title: "Bespoke Request & Specifying", desc: "Clients specify design profiles, measurements, wood grains, or fabric weights with our concierge team." },
  { step: "02", title: "Global Atelier Matching", desc: "We direct the order to the respective specialized atelier (e.g. marble in Turkey, wood in Vietnam) best suited for the build." },
  { step: "03", title: "Artisan Crafting & QC Check", desc: "The item is crafted. Local quality inspectors run physical verification checks on tolerances, moisture levels, and finishes." },
  { step: "04", title: "White-Glove Shipping & Install", desc: "Secure sea or air transit with custom crating, followed by local in-room placement and assembly by trained curators." }
];

export default function SourcingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".sourcing-hero-text",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", stagger: 0.2 }
      );

      gsap.fromTo(".country-card",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".country-grid",
            start: "top 85%",
          }
        }
      );

      gsap.fromTo(".procure-step",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.25,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".procure-timeline",
            start: "top 85%"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-lux-bg min-h-screen relative overflow-hidden pb-40">
      
      {/* Subtle Grid / Noise Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
      
      {/* Hero Section */}
      <section className="pt-40 pb-28 px-6 md:px-12 max-w-[1400px] mx-auto text-center">
        <span className="sourcing-hero-text uppercase tracking-[0.35em] text-[10px] text-lux-gold font-semibold mb-4 block">
          Global Supply Chain
        </span>
        <h1 className="sourcing-hero-text font-serif text-5xl md:text-8xl text-lux-dark mb-8 tracking-tight leading-none">
          Global Sourcing, <br />
          <span className="italic text-lux-gold font-light">Exquisite</span> Execution
        </h1>
        <p className="sourcing-hero-text font-sans font-light text-lux-text-muted text-xl leading-relaxed max-w-3xl mx-auto mb-16">
          We traverse international design regions to discover and secure bespoke furniture. Every material is sourced with intention, quality-controlled locally, and delivered personally to match your architectural vision.
        </p>

        {/* Global standards icons banner */}
        <div className="sourcing-hero-text flex flex-wrap justify-center gap-12 border-y border-lux-border/60 py-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Compass size={18} className="text-lux-gold" />
            <span className="text-xs uppercase tracking-widest text-lux-dark font-semibold">Curated Origins</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-lux-gold" />
            <span className="text-xs uppercase tracking-widest text-lux-dark font-semibold">Strict Local Quality Checks</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-lux-gold" />
            <span className="text-xs uppercase tracking-widest text-lux-dark font-semibold">Direct Atelier Sourcing</span>
          </div>
        </div>
      </section>

      {/* Country Cards Detailed Section */}
      <section className="px-6 md:px-12 max-w-[1600px] mx-auto mb-40">
        <div className="country-grid grid grid-cols-1 lg:grid-cols-2 gap-12">
          {sourcingDetails.map((item) => (
            <div
              key={item.country}
              className="country-card bg-white border border-lux-border/50 p-6 md:p-10 rounded-sm hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-700 flex flex-col md:grid md:grid-cols-12 gap-8"
            >
              {/* Image box (5 cols) */}
              <div className="relative h-[250px] md:h-full md:col-span-5 overflow-hidden rounded-sm bg-lux-bg">
                <Image
                  src={item.image}
                  alt={item.country}
                  fill
                  sizes="(max-width: 768px) 100vw, 20vw"
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                />
              </div>

              {/* Text box (7 cols) */}
              <div className="md:col-span-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <item.icon className="w-5 h-5 text-lux-gold" />
                    <span className="text-[10px] uppercase tracking-widest text-lux-gold font-bold">{item.country}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-lux-dark mb-4">{item.tagline}</h3>
                  <p className="font-sans text-xs md:text-sm text-lux-text-muted font-light leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <div className="border-t border-lux-border/50 pt-4 mt-auto">
                  <span className="text-[9px] uppercase tracking-widest text-lux-text-muted/60 block mb-2 font-semibold">Key Materials:</span>
                  <div className="flex flex-wrap gap-2">
                    {item.materials.map((mat, i) => (
                      <span key={i} className="px-3 py-1 bg-lux-bg-alt border border-lux-border/40 rounded-full text-[10px] font-sans text-lux-dark font-medium">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Procurement Process Timeline */}
      <section className="px-6 md:px-12 max-w-[1200px] mx-auto">
        <h2 className="text-center font-serif text-4xl md:text-5xl text-lux-dark mb-24 uppercase tracking-wide">
          Our Sourcing & Procurement Process
        </h2>

        <div className="procure-timeline relative border-l border-lux-gold/30 pl-12 md:pl-20 space-y-16 max-w-3xl mx-auto">
          {procurementProcess.map((item) => (
            <div key={item.step} className="procure-step relative">
              {/* Interactive Bullet */}
              <div className="absolute -left-[54px] md:-left-[86px] top-1.5 w-3.5 h-3.5 bg-lux-bg border-2 border-lux-gold rounded-full" />
              
              <span className="text-lux-gold font-serif text-lg tracking-widest block mb-2 font-bold">
                {item.step}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-lux-dark mb-3 leading-tight">{item.title}</h3>
              <p className="font-sans font-light text-lux-text-muted text-sm md:text-base leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}
