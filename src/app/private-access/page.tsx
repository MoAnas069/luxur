"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";

export default function PrivateAccessPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Step 1: form details, Step 2: OTP verification
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  // Countdown timer for OTP expiry (5 minutes)
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerActive, setTimerActive] = useState(false);

  const otpInputRefs = useRef<HTMLInputElement[]>([]);

  // Initial load animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { y: 80, opacity: 0, filter: "blur(20px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".pa-reveal",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out", delay: 0.5 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  // Transition animations when step changes
  useEffect(() => {
    if (step === 2) {
      gsap.fromTo(
        ".step-2-el",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 }
      );
      // Auto focus first OTP input field
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } else if (step === 1) {
      gsap.fromTo(
        ".step-1-el",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 }
      );
    }
  }, [step]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 1: Submit Form to send OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setWarning("");

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send verification code. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (data.warning) {
        setWarning(data.warning);
      }

      // If in development mode and Resend key is missing, show devCode helper
      if (data.devCode) {
        console.log(`[DEV MODE] Bypass Verification Code: ${data.devCode}`);
      }

      // Animate out Step 1 elements before state change
      gsap.to(".step-1-el", {
        opacity: 0,
        y: -15,
        duration: 0.35,
        ease: "power2.in",
        stagger: 0.04,
        onComplete: () => {
          setStep(2);
          setTimeLeft(300); // 5 minutes
          setTimerActive(true);
          setIsSubmitting(false);
        },
      });
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the full 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setWarning("");

    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Incorrect verification code.");
        setIsSubmitting(false);
        return;
      }

      // Grant access via sessionStorage
      sessionStorage.setItem(
        "luxura_private_access",
        JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone,
          ts: Date.now() 
        })
      );

      // Animate out and redirect
      gsap.to(cardRef.current, {
        y: -50,
        opacity: 0,
        filter: "blur(15px)",
        duration: 0.9,
        ease: "power2.inOut",
        onComplete: () => router.push("/private-catalogue"),
      });
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred. Please verify your connection.");
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (timeLeft > 0) return;
    
    setIsSubmitting(true);
    setError("");
    setWarning("");
    setOtp(Array(6).fill(""));

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend code.");
        setIsSubmitting(false);
        return;
      }

      if (data.warning) {
        setWarning(data.warning);
      }

      setTimeLeft(300);
      setTimerActive(true);
      setIsSubmitting(false);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error(err);
      setError("Failed to request a new code. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Handle back button click to return to details
  const handleBackToDetails = () => {
    gsap.to(".step-2-el", {
      opacity: 0,
      y: 15,
      duration: 0.35,
      ease: "power2.in",
      stagger: 0.04,
      onComplete: () => {
        setStep(1);
        setError("");
        setWarning("");
        setOtp(Array(6).fill(""));
        setTimerActive(false);
      },
    });
  };

  // Manage individual digit boxes in OTP input
  const handleOtpBoxChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return; // digit characters only
    
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // keep latest character
    setOtp(newOtp);

    // Auto-focus next input box
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all digits entered
    const completedCode = newOtp.join("");
    if (completedCode.length === 6) {
      // Trigger verify using the newly completed code
      setTimeout(() => {
        setIsSubmitting(true);
        fetch("/api/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, code: completedCode }),
        })
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
              setError(data.error || "Incorrect verification code.");
              setIsSubmitting(false);
              return;
            }
            
            sessionStorage.setItem(
              "luxura_private_access",
              JSON.stringify({ 
                name: formData.name, 
                email: formData.email, 
                phone: formData.phone,
                ts: Date.now() 
              })
            );

            gsap.to(cardRef.current, {
              y: -50,
              opacity: 0,
              filter: "blur(15px)",
              duration: 0.9,
              ease: "power2.inOut",
              onComplete: () => router.push("/private-catalogue"),
            });
          })
          .catch((err) => {
            console.error(err);
            setError("Verification check failed.");
            setIsSubmitting(false);
          });
      }, 100);
    }
  };

  const handleOtpBoxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpInputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpBoxPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && !isNaN(Number(pasteData))) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      otpInputRefs.current[5]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-lux-bg flex items-center justify-center px-5 py-28 md:py-32 relative overflow-hidden"
    >
      {/* Background grain */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Ambient glow */}
      <div className="absolute top-1/4 -right-40 w-[700px] h-[700px] bg-lux-gold/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-lux-gold/[0.03] blur-[160px] rounded-full pointer-events-none" />

      <div ref={cardRef} className="relative w-full max-w-[480px]">
        {/* Glass card backdrop */}
        <div className="absolute inset-0 bg-white/55 backdrop-blur-2xl border border-white/70 shadow-[0_50px_100px_-25px_rgba(0,0,0,0.07)] rounded-sm pointer-events-none" />

        <div className="relative px-10 py-14 md:px-14 md:py-16">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="pa-reveal w-14 h-14 mx-auto rounded-full border border-lux-gold/20 flex items-center justify-center mb-6">
              <Lock size={18} className="text-lux-gold" strokeWidth={1.5} />
            </div>
            <div className="pa-reveal uppercase tracking-[0.35em] text-[10px] text-lux-gold font-semibold mb-3">
              Private Access Gate
            </div>
            <h1 className="pa-reveal font-serif text-3xl md:text-4xl text-lux-dark leading-tight mb-3">
              Exclusive <span className="italic text-lux-gold font-serif">Collections</span>
            </h1>
            <p className="pa-reveal text-lux-text-muted font-sans text-sm leading-relaxed max-w-xs mx-auto">
              {step === 1 
                ? "Verify your details below to request a secure verification code to access our private catalogues."
                : "Please enter the 6-digit verification code sent to your email to authenticate your access."
              }
            </p>
          </div>

          {step === 1 ? (
            /* STEP 1: Details Request Form */
            <form onSubmit={handleRequestOtp} className="space-y-6">
              <div className="step-1-el pa-reveal">
                <label className="uppercase tracking-[0.2em] text-[10px] text-lux-text-muted mb-2.5 block font-semibold font-sans">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full bg-lux-bg border border-black/[0.06] px-5 py-4 font-sans text-lux-dark placeholder:text-lux-text-muted/40 focus:outline-none focus:ring-1 focus:ring-lux-gold/40 focus:border-lux-gold/20 transition-all duration-500 rounded-sm text-[15px]"
                />
              </div>

              <div className="step-1-el pa-reveal">
                <label className="uppercase tracking-[0.2em] text-[10px] text-lux-text-muted mb-2.5 block font-semibold font-sans">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full bg-lux-bg border border-black/[0.06] px-5 py-4 font-sans text-lux-dark placeholder:text-lux-text-muted/40 focus:outline-none focus:ring-1 focus:ring-lux-gold/40 focus:border-lux-gold/20 transition-all duration-500 rounded-sm text-[15px]"
                />
              </div>

              <div className="step-1-el pa-reveal">
                <label className="uppercase tracking-[0.2em] text-[10px] text-lux-text-muted mb-2.5 block font-semibold font-sans">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-lux-bg border border-black/[0.06] px-5 py-4 font-sans text-lux-dark placeholder:text-lux-text-muted/40 focus:outline-none focus:ring-1 focus:ring-lux-gold/40 focus:border-lux-gold/20 transition-all duration-500 rounded-sm text-[15px]"
                />
              </div>

              {error && (
                <p className="text-red-600/80 text-xs font-sans tracking-wide step-1-el">{error}</p>
              )}

              {warning && (
                <p className="text-amber-600/95 text-[11px] font-sans leading-relaxed step-1-el bg-amber-500/5 border border-amber-500/10 p-3 rounded-sm">{warning}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="step-1-el pa-reveal w-full mt-2 py-5 bg-lux-dark text-white uppercase tracking-[0.2em] text-[11px] font-semibold relative overflow-hidden group disabled:opacity-60 transition-all rounded-sm flex items-center justify-center gap-3 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-lux-gold-deep via-lux-gold to-lux-gold-deep opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <span className="relative z-10">
                  {isSubmitting ? "Generating Code..." : "Send Verification Code"}
                </span>
                {!isSubmitting && (
                  <ArrowRight
                    size={14}
                    className="relative z-10 group-hover:translate-x-1 transition-transform"
                  />
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Verification Code Input */
            <form onSubmit={handleVerifyOtp} className="space-y-7">
              <div className="step-2-el">
                <button
                  type="button"
                  onClick={handleBackToDetails}
                  className="flex items-center gap-2 text-lux-gold hover:text-lux-gold-deep font-sans text-xs tracking-wider uppercase font-semibold transition-colors duration-300 mb-6 cursor-pointer"
                >
                  <ArrowLeft size={12} />
                  <span>Back to details</span>
                </button>

                <p className="text-lux-text-muted font-sans text-[13px] leading-relaxed mb-4">
                  We have sent a verification code to <span className="font-semibold text-lux-dark break-all">{formData.email}</span>.
                </p>
              </div>

              {/* 6-digit OTP Box inputs */}
              <div className="step-2-el flex justify-between gap-2.5 my-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      if (el) otpInputRefs.current[i] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpBoxChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpBoxKeyDown(e, i)}
                    onPaste={handleOtpBoxPaste}
                    className="w-12 h-14 md:w-14 md:h-16 text-center font-sans text-xl md:text-2xl font-bold bg-lux-bg border border-black/[0.06] focus:outline-none focus:ring-1 focus:ring-lux-gold/50 focus:border-lux-gold/30 rounded-sm text-lux-dark transition-all duration-300"
                  />
                ))}
              </div>

              {/* Timer & Expiry */}
              <div className="step-2-el flex flex-col items-center justify-center space-y-3.5 text-center py-2 border-y border-black/[0.03]">
                {timeLeft > 0 ? (
                  <p className="font-sans text-[13px] text-lux-text-muted">
                    Code expires in <span className="font-mono font-semibold text-lux-dark text-sm">{formatTime(timeLeft)}</span>
                  </p>
                ) : (
                  <p className="font-sans text-[13px] text-red-500 font-medium">
                    The verification code has expired.
                  </p>
                )}

                <div className="text-[12px] font-sans">
                  <span className="text-lux-text-muted/60">Didn&apos;t receive the code? </span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={timeLeft > 0 || isSubmitting}
                    className={`font-semibold tracking-wide uppercase text-[10px] transition-colors duration-300 cursor-pointer ${
                      timeLeft > 0
                        ? "text-lux-text-muted/30 cursor-not-allowed"
                        : "text-lux-gold hover:text-lux-gold-deep"
                    }`}
                  >
                    Resend Code
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-600/80 text-xs font-sans tracking-wide text-center step-2-el">{error}</p>
              )}

              {warning && (
                <p className="text-amber-600/95 text-[11px] font-sans leading-relaxed text-center step-2-el bg-amber-500/5 border border-amber-500/10 p-3 rounded-sm">{warning}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || otp.join("").length !== 6}
                className="step-2-el w-full py-5 bg-lux-dark text-white uppercase tracking-[0.2em] text-[11px] font-semibold relative overflow-hidden group disabled:opacity-40 transition-all rounded-sm flex items-center justify-center gap-3 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-lux-gold-deep via-lux-gold to-lux-gold-deep opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <span className="relative z-10">
                  {isSubmitting ? "Verifying..." : "Verify & Access"}
                </span>
                {!isSubmitting && (
                  <ArrowRight
                    size={14}
                    className="relative z-10 group-hover:translate-x-1 transition-transform"
                  />
                )}
              </button>
            </form>
          )}

          {/* Footer note */}
          <p className="pa-reveal text-center text-[10px] text-lux-text-muted/50 mt-8 tracking-wide font-sans">
            Your information is kept private and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
