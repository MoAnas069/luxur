"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Sourcing", href: "/sourcing" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isTransparent = !isScrolled && !mobileMenuOpen;
  const isDarkBg = pathname === "/" && isTransparent;
  const headerTextColor = isDarkBg ? "text-white" : "text-lux-text";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-lux-bg/90 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6 md:py-8"
      } ${headerTextColor}`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link href="/" className="text-3xl md:text-4xl font-serif tracking-widest uppercase relative z-50">
          Luxura
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const linkColor = isActive 
              ? "text-lux-gold" 
              : (isDarkBg ? "text-white/80" : "text-lux-text");
            const hoverColor = isDarkBg && !isActive ? "hover:text-white" : "hover:text-lux-gold";

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm tracking-widest uppercase transition-colors duration-300 ${linkColor} ${hoverColor}`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/private-access"
            className={`ml-2 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase font-semibold border transition-all duration-500 ${
              isDarkBg
                ? "border-lux-gold/50 text-lux-gold hover:bg-lux-gold hover:text-white"
                : "border-lux-gold/40 text-lux-gold hover:bg-lux-gold hover:text-white"
            }`}
          >
            Private Catalogue
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden relative z-50 transition-colors ${
            mobileMenuOpen ? "text-lux-text" : headerTextColor
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={32} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`absolute top-full left-0 w-full bg-lux-bg/95 backdrop-blur-xl border-t border-lux-border/50 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden overflow-hidden ${
          mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center py-10 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-serif tracking-[0.2em] uppercase transition-all duration-300 ${
                pathname === link.href ? "text-lux-gold scale-105" : "text-lux-text hover:text-lux-gold"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-12 h-[1px] bg-lux-gold/30 mt-4 mb-2"></div>
          <Link
            href="/private-access"
            onClick={() => setMobileMenuOpen(false)}
            className="px-6 py-3 text-xs tracking-[0.2em] uppercase font-semibold border border-lux-gold/40 text-lux-gold hover:bg-lux-gold hover:text-white transition-all duration-500"
          >
            Private Catalogue
          </Link>
        </div>
      </div>
    </header>
  );
}
