"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".reveal-element", 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-40 pb-32 min-h-screen px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="mb-24 text-center reveal-element">
        <h1 className="text-5xl md:text-7xl font-serif text-lux-dark tracking-tight">
          Begin Your Space
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* Left Side: Information */}
        <div className="reveal-element pr-0 lg:pr-16">
          <p className="font-sans font-light text-lux-text-muted text-xl leading-relaxed mb-12">
            Whether you are commissioning a single bespoke piece or curating an entire estate, our concierge team is at your disposal to orchestrate every detail.
          </p>

          <div className="space-y-12">
            <div>
              <h4 className="uppercase tracking-widest text-lux-gold text-sm font-semibold mb-3">Direct Inquiry</h4>
              <p className="font-serif text-2xl text-lux-dark">concierge@luxura.com</p>
            </div>
            
            <div>
              <h4 className="uppercase tracking-widest text-lux-gold text-sm font-semibold mb-3">WhatsApp Private Line</h4>
              <p className="font-serif text-2xl text-lux-dark">
                <a href="https://wa.me/14039717695" target="_blank" rel="noopener noreferrer" className="hover:text-lux-gold transition-colors">
                  +1 (403) 971-7695
                </a>
              </p>
            </div>

            <div>
              <h4 className="uppercase tracking-widest text-lux-gold text-sm font-semibold mb-3">Service Regions</h4>
              <p className="font-sans font-light text-lux-text-muted text-lg">
                London • New York • Dubai • Paris • Los Angeles
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="reveal-element bg-white p-10 md:p-14 shadow-sm border border-lux-border">
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">First Name</label>
                <input 
                  type="text" 
                  className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors"
                />
              </div>
              <div className="flex flex-col">
                <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">Last Name</label>
                <input 
                  type="text" 
                  className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">Email Address</label>
              <input 
                type="email" 
                className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors"
              />
            </div>

            <div className="flex flex-col">
              <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">Project Details</label>
              <textarea 
                rows={4}
                className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors resize-none"
              ></textarea>
            </div>

            <button 
              type="button" 
              className="w-full mt-4 py-4 bg-lux-dark text-white uppercase tracking-widest text-sm hover:bg-lux-gold transition-colors duration-500"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
