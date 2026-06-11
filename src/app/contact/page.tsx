"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !details.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          details,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        // Clear form fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setDetails("");
      } else {
        setError(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      gsap.fromTo(
        ".success-container",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [submitSuccess]);

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
              <h4 className="uppercase tracking-widest text-lux-gold text-sm font-semibold mb-3">Contact</h4>
              <p className="font-serif text-2xl text-lux-dark">
                <a href="mailto:support@luxurafurniture.com" className="hover:text-lux-gold transition-colors">
                  support@luxurafurniture.com
                </a>
              </p>
            </div>

            <div>
              <h4 className="uppercase tracking-widest text-lux-gold text-sm font-semibold mb-3">Service region</h4>
              <p className="font-sans font-light text-lux-text-muted text-lg">
                Canada • USA • UK • India • Australia • UAE
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form / Success Card */}
        <div className="reveal-element bg-white p-10 md:p-14 shadow-sm border border-lux-border min-h-[460px] flex flex-col justify-center">
          {!submitSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-8 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col">
                  <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">First Name</label>
                  <input 
                    type="text" 
                    required
                    disabled={isSubmitting}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">Last Name</label>
                  <input 
                    type="text" 
                    required
                    disabled={isSubmitting}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">Email Address</label>
                <input 
                  type="email" 
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col">
                <label className="uppercase tracking-widest text-xs text-lux-text-muted mb-2 font-semibold">Project Details</label>
                <textarea 
                  rows={4}
                  required
                  disabled={isSubmitting}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="border-b border-lux-border py-3 bg-transparent font-sans text-lux-dark focus:outline-none focus:border-lux-gold transition-colors resize-none disabled:opacity-50"
                ></textarea>
              </div>

              {error && (
                <p className="text-red-600/80 text-xs font-sans tracking-wide mt-2">{error}</p>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-4 py-4 bg-lux-dark text-white uppercase tracking-widest text-sm hover:bg-lux-gold transition-colors duration-500 disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  "Submit Inquiry"
                )}
              </button>
            </form>
          ) : (
            <div className="success-container text-center py-6 w-full animate-fade-in">
              <div className="w-16 h-16 rounded-full border border-lux-gold/20 flex items-center justify-center mx-auto mb-6 bg-lux-bg-alt">
                <svg className="w-6 h-6 text-lux-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                </svg>
              </div>
              <h3 className="font-serif text-3xl text-lux-dark mb-4">Request Received</h3>
              <p className="font-sans font-light text-lux-text-muted text-sm leading-relaxed max-w-sm mx-auto mb-8">
                Your consultation request has been successfully recorded. A member of our concierge team will reach out to you within 24 hours.
              </p>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="px-8 py-4 bg-lux-dark text-white uppercase tracking-widest text-xs font-semibold hover:bg-lux-gold transition-colors duration-500"
              >
                Send Another Message
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
