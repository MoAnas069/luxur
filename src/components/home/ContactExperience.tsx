"use client";

import { useState } from "react";

export default function ContactExperience() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [vision, setVision] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `Hello Luxura Team,

I would like to request a private consultation. Here are my details:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Project Vision: ${vision}`;

    const waUrl = `https://wa.me/14039717695?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <section id="contact-section" className="py-32 bg-lux-bg-ivory px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto text-center">
        <h2 className="font-serif text-5xl md:text-7xl text-lux-dark mb-8">Begin Your Space</h2>
        <p className="font-sans text-xl text-lux-text-muted font-light mb-16 max-w-2xl mx-auto">
          Schedule a private consultation to discuss your vision with our architectural curators.
        </p>

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-12 bg-white p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-lux-border relative overflow-hidden group">
          {/* Subtle gold glow on hover */}
          <div className="absolute inset-0 bg-lux-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="flex flex-col text-left">
              <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">First Name</label>
              <input 
                type="text" 
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors" 
              />
            </div>
            <div className="flex flex-col text-left">
              <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">Last Name</label>
              <input 
                type="text" 
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors" 
              />
            </div>
          </div>

          <div className="flex flex-col text-left relative z-10">
            <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors" 
            />
          </div>

          <div className="flex flex-col text-left relative z-10">
            <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">Project Vision</label>
            <textarea 
              rows={4} 
              required
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors resize-none"
            />
          </div>

          <button type="submit" className="w-full py-5 bg-lux-dark text-white uppercase tracking-widest text-sm hover:bg-lux-gold transition-colors duration-500 relative z-10">
            Request Private Consultation
          </button>
        </form>
      </div>
    </section>
  );
}
