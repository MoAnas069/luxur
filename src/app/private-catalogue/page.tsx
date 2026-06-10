"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { BookOpen, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

const MagazineViewer = dynamic(
  () => import("@/components/catalogue/MagazineViewer"),
  { ssr: false }
);

// ─── CATALOGUE DATA ───
// Each catalogue entry points to a self-contained HTML magazine file
// stored in /public/magazines/. The `src` path is served from the root.
interface CatalogueEntry {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  /** Path to the HTML magazine file, e.g. "/magazines/volume-1.html" */
  src: string;
  year: string;
  category: string;
}

export default function PrivateCataloguePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [activeMagazine, setActiveMagazine] = useState<CatalogueEntry | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dynamicCatalogues, setDynamicCatalogues] = useState<CatalogueEntry[]>([]);
  const [coverErrors, setCoverErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchMagazines() {
      try {
        const { data, error } = await supabase
          .from("magazines")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching magazines from Supabase:", error);
          return;
        }

        if (data) {
          const mapped: CatalogueEntry[] = data.map((row: any) => ({
            id: `db-${row.id}`,
            title: row.title || "Untitled Lookbook",
            subtitle: row.issue || row.description || "Private Catalogue",
            cover: row.cover_url || "/images/cover_fallback.webp",
            src: row.pdf_url,
            year: row.published_at ? new Date(row.published_at).getFullYear().toString() : new Date().getFullYear().toString(),
            category: row.category || "Catalogue"
          }));
          setDynamicCatalogues(mapped);
        }
      } catch (err) {
        console.error("Unexpected error fetching magazines:", err);
      }
    }

    fetchMagazines();
  }, []);

  const allCatalogues = dynamicCatalogues;

  // Derive categories dynamically from catalogues
  const categories = [
    "All",
    ...Array.from(new Set(allCatalogues.map((c) => c.category).filter(Boolean)))
  ];

  // Filter magazines based on selected category
  const filteredCatalogues = selectedCategory === "All"
    ? allCatalogues
    : allCatalogues.filter((c) => c.category === selectedCategory);

  // Access gate
  useEffect(() => {
    const stored = sessionStorage.getItem("luxura_private_access");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.name && data.email) {
          setHasAccess(true);
        }
      } catch {
        /* invalid */
      }
    }
    setIsChecking(false);
  }, []);

  // Handle browser back button to close active magazine
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (activeMagazine) {
        setActiveMagazine(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [activeMagazine]);

  const handleOpenMagazine = (cat: CatalogueEntry) => {
    setActiveMagazine(cat);
    window.history.pushState({ magazineOpen: true }, "");
  };

  const handleCloseMagazine = () => {
    if (window.history.state?.magazineOpen) {
      window.history.back();
    }
    setActiveMagazine(null);
  };

  // Animations after access granted
  useEffect(() => {
    if (!hasAccess || isChecking) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cat-header",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.15 }
      );
      gsap.fromTo(
        ".cat-card",
        { y: 70, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.35,
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [hasAccess, isChecking]);

  // Loading state
  if (isChecking) {
    return (
      <div className="min-h-screen bg-lux-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-lux-gold/30 border-t-lux-gold rounded-full animate-spin" />
      </div>
    );
  }

  // Access denied
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-lux-bg flex items-center justify-center px-6 py-32">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full border border-lux-gold/20 flex items-center justify-center mb-8">
            <BookOpen size={22} className="text-lux-gold" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-lux-dark mb-4">
            Access Required
          </h1>
          <p className="text-lux-text-muted font-sans text-sm leading-relaxed mb-10">
            This area contains our private luxury catalogues. Please verify your identity to gain access.
          </p>
          <button
            onClick={() => router.push("/private-access")}
            className="px-10 py-4 bg-lux-dark text-white uppercase tracking-[0.2em] text-[11px] font-semibold hover:bg-lux-gold transition-colors duration-700 rounded-sm"
          >
            Request Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-lux-bg relative overflow-hidden">
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Hero header */}
      <div className="cat-header pt-36 md:pt-44 pb-16 md:pb-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="uppercase tracking-[0.35em] text-[10px] text-lux-gold font-semibold mb-4">
              Private Collection
            </div>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-lux-dark leading-[1.1] mb-5">
              Welcome to the <span className="italic text-lux-gold">Private Collection</span>
            </h1>
            <p className="text-lux-text-muted font-sans text-base md:text-lg max-w-xl leading-relaxed">
              Browse our exclusive catalogues below. Each collection is curated from premium global manufacturers and design partners.
            </p>
          </div>

          {/* Category Filter Tabs */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 md:gap-4 border-b border-lux-border/60 pb-2 self-start lg:self-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-colors duration-500 ${
                    selectedCategory === cat ? "text-lux-gold" : "text-lux-text-muted hover:text-lux-dark"
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-lux-gold animate-line-expand" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Magazine Grid */}
      <div className="px-6 md:px-12 pb-32">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredCatalogues.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleOpenMagazine(cat)}
              className="cat-card group text-left relative rounded-sm overflow-hidden bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] transition-shadow duration-700"
            >
              {/* Cover Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={coverErrors[cat.id] ? "/images/curated_collections.webp" : cat.cover}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onError={() => {
                    setCoverErrors((prev) => ({ ...prev, [cat.id]: true }));
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-700" />

                {/* View overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 scale-75 group-hover:scale-100 transition-transform duration-500">
                    <Eye size={22} className="text-white" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-sm border border-white/20">
                  <span className="text-white text-[9px] tracking-[0.2em] uppercase font-semibold">
                    {cat.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 md:p-7">
                <h3 className="font-serif text-xl md:text-2xl text-lux-dark mb-1 group-hover:text-lux-gold transition-colors duration-500">
                  {cat.title}
                </h3>
                <p className="text-lux-text-muted font-sans text-sm">
                  {cat.subtitle}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-lux-border">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-lux-text-muted/60 font-sans font-semibold">
                    {cat.year} Edition
                  </span>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-lux-gold font-semibold group-hover:tracking-[0.25em] transition-all duration-500">
                    View Magazine →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Magazine Viewer Modal — iframe-based for full HTML magazines */}
      {activeMagazine && (
        <MagazineViewer
          title={activeMagazine.title}
          src={activeMagazine.src}
          onClose={handleCloseMagazine}
        />
      )}
    </div>
  );
}
