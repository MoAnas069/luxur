"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { BookOpen, Eye, ArrowLeft, Crown, Star, Award, Sofa, Lightbulb, Grid } from "lucide-react";
import { supabase } from "@/lib/supabase";
import coversMapping from "../../../public/images/mag_covers/covers_mapping.json";


gsap.registerPlugin(ScrollTrigger);

const MagazineViewer = dynamic(
  () => import("@/components/catalogue/MagazineViewer"),
  { ssr: false }
);

// ─── CATALOGUE DATA ───
interface CatalogueEntry {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  src: string;
  year: string;
  category: string;
  tier: string;
}

// ─── TIER PARSER ───
const TIER_VALUES = ["Elite", "Premium", "Signature"];
function parseTier(raw: string): { tier: string; cat: string } {
  const val = (raw || "").replace(/\bcatalogue\b/i, "").trim();
  for (const t of TIER_VALUES) {
    if (val.toLowerCase().startsWith(t.toLowerCase())) {
      const rest = val.slice(t.length).replace(/^\s*[-\u2013]?\s*/, "").trim();
      return { tier: t, cat: rest };
    }
  }
  return { tier: "Signature", cat: val };
}

// ─── TIER DEFINITIONS ───
const tiers = [
  {
    id: "Elite",
    title: "Elite",
    subtitle: "The Pinnacle of Luxury",
    description:
      "Our most exclusive collection — handcrafted masterpieces sourced from the world's finest ateliers. Each piece represents the absolute zenith of material quality, artisan craftsmanship, and design exclusivity.",
    image: "/images/tier_elite.webp",
    icon: Crown,
  },
  {
    id: "Premium",
    title: "Premium",
    subtitle: "Refined Excellence",
    description:
      "Curated selections balancing exceptional quality with sophisticated design. Premium pieces feature superior materials and meticulous construction for discerning interiors that demand distinction.",
    image: "/images/tier_premium.webp",
    icon: Star,
  },
  {
    id: "Signature",
    title: "Signature",
    subtitle: "Timeless Elegance",
    description:
      "The foundation of the Luxura experience — beautifully crafted furniture that brings elevated design sensibility to every space. Signature pieces deliver enduring style and impeccable quality.",
    image: "/images/tier_signature.webp",
    icon: Award,
  },
];

// ─── MAIN SECTIONS DEFINITIONS ───
const mainCategories = [
  {
    id: "furniture",
    title: "Furniture Collection",
    subtitle: "Elite, Premium & Signature Tiers",
    description: "Discover our curated furniture collections ranging from hand-crafted masterworks to contemporary signature essentials.",
    image: "/images/cat_furniture.png",
    icon: Sofa
  },
  {
    id: "lighting",
    title: "Lighting & Luminaires",
    subtitle: "Artisanal Lighting Sculptures",
    description: "Explore bespoke chandeliers, pendants, and architectural lighting designs that transform luxury interiors.",
    image: "/images/cat_lighting.png",
    icon: Lightbulb
  },
  {
    id: "others",
    title: "Exclusive Curations",
    subtitle: "Rugs, Decor & Artworks",
    description: "Browse curated design accents, custom made carpets, artificial foliage, and other luxury interior accessories.",
    image: "/images/cat_others.png",
    icon: Grid
  }
];

export default function PrivateCataloguePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [activeMagazine, setActiveMagazine] = useState<CatalogueEntry | null>(null);
  
  // Navigation states
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("All");
  
  const [dynamicCatalogues, setDynamicCatalogues] = useState<CatalogueEntry[]>([]);
  const [coverErrors, setCoverErrors] = useState<Record<string, boolean>>({});

  // Fetch magazines from Supabase
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
          const mapped: CatalogueEntry[] = data.map((row: any) => {
            let type = (row.type || "").trim();
            let cat = (row.category || "").trim();
            if (!type) {
              const parsed = parseTier(cat);
              type = parsed.tier;
              cat = parsed.cat;
            }

            // Normalize category for standard matching
            const normCat = cat.toLowerCase();
            if (normCat.includes("living")) {
              cat = "Living";
            } else if (normCat.includes("bedroom") || normCat.includes("bed")) {
              cat = "Bed";
            } else if (normCat.includes("dining")) {
              cat = "Dining";
            } else if (normCat.includes("office")) {
              cat = "Office";
            } else if (normCat.includes("lighting") || normCat.includes("light")) {
              cat = "Lighting";
            }

            // Prefer custom uploaded covers from storage over static local mapping
            const hasCustomCover = row.cover_url && (row.cover_url.startsWith("http") || row.cover_url.includes("/storage/"));
            const coverUrl = hasCustomCover 
              ? row.cover_url 
              : ((coversMapping as Record<string, string>)[row.id] || row.cover_url || "/images/cover_fallback.webp");

            return {
              id: `db-${row.id}`,
              title: row.title || "Untitled Lookbook",
              subtitle: row.issue || row.description || "Private Catalogue",
              cover: coverUrl,
              src: row.pdf_url,
              year: row.published_at ? new Date(row.published_at).getFullYear().toString() : new Date().getFullYear().toString(),
              category: cat,
              tier: type,
            };
          });
          setDynamicCatalogues(mapped);
        }
      } catch (err) {
        console.error("Unexpected error fetching magazines:", err);
      }
    }

    fetchMagazines();
  }, []);


  // Helper function to extract leading numbers for Google Drive style sorting
  const getLeadingNumber = (str: string): number | null => {
    const match = (str || "").trim().match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Sort helper function matching Drive index
  const sortCatalogues = (items: CatalogueEntry[]): CatalogueEntry[] => {
    return [...items].sort((a, b) => {
      const numA = getLeadingNumber(a.title);
      const numB = getLeadingNumber(b.title);
      if (numA !== null && numB !== null) {
        return numA - numB;
      }
      if (numA !== null) return -1;
      if (numB !== null) return 1;
      return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" });
    });
  };

  // Filter magazines dynamically based on current section, selected tier, and sub-category
  const filteredCatalogues = useMemo(() => {
    if (!currentSection) return [];
    
    if (currentSection === "lighting") {
      return sortCatalogues(dynamicCatalogues.filter(c => c.category === "Lighting"));
    }
    
    if (currentSection === "others") {
      const furnitureCategories = ["Living", "Bed", "Dining", "Office"];
      return sortCatalogues(dynamicCatalogues.filter(
        c => c.category !== "Lighting" && !furnitureCategories.includes(c.category)
      ));
    }
    
    if (currentSection === "furniture") {
      if (!selectedTier) return [];
      
      const furnitureCategories = ["Living", "Bed", "Dining", "Office"];
      let list = dynamicCatalogues.filter(
        c => c.tier.toLowerCase() === selectedTier.toLowerCase() && furnitureCategories.includes(c.category)
      );
      
      if (selectedSubCategory !== "All") {
        let targetCat = selectedSubCategory;
        if (selectedSubCategory === "Bedroom") {
          targetCat = "Bed";
        }
        list = list.filter(c => c.category === targetCat);
      }
      
      return sortCatalogues(list);
    }
    
    return [];
  }, [currentSection, selectedTier, selectedSubCategory, dynamicCatalogues]);

  // Dynamically determine headers and back button behavior
  const headerInfo = useMemo(() => {
    if (currentSection === "lighting") {
      return {
        subtitle: "Lighting & Luminaires",
        title: "Lighting Collection",
        description: "Explore our simple and elegant collection of luxury lighting workbooks and portfolios.",
        backText: "Back to Collections",
        onBack: handleBackToSections
      };
    }
    
    if (currentSection === "others") {
      return {
        subtitle: "Exclusive Curations",
        title: "Curated Accents Collection",
        description: "Browse premium custom rugs, home decor accessories, planters, water fountains, and smart design elements.",
        backText: "Back to Collections",
        onBack: handleBackToSections
      };
    }
    
    if (currentSection === "furniture") {
      const activeTier = tiers.find((t) => t.id === selectedTier);
      return {
        subtitle: `Furniture Collection • ${activeTier?.subtitle || "Private"}`,
        title: `${selectedTier} Collection`,
        description: activeTier?.description || "Browse our exclusive furniture catalogues below.",
        backText: "Back to Tiers",
        onBack: handleBackToTiers
      };
    }
    
    return {
      subtitle: "",
      title: "",
      description: "",
      backText: "",
      onBack: () => {}
    };
  }, [currentSection, selectedTier]);

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

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (activeMagazine) {
        setActiveMagazine(null);
      } else if (selectedTier) {
        setSelectedTier(null);
        setSelectedSubCategory("All");
      } else if (currentSection) {
        setCurrentSection(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [activeMagazine, selectedTier, currentSection]);

  const handleSelectSection = (sectionId: string) => {
    setCurrentSection(sectionId);
    window.history.pushState({ sectionOpen: true }, "");
  };

  function handleBackToSections() {
    if (window.history.state?.sectionOpen) {
      window.history.back();
    } else {
      setCurrentSection(null);
      setSelectedTier(null);
      setSelectedSubCategory("All");
    }
  }

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId);
    setSelectedSubCategory("All");
    window.history.pushState({ tierOpen: true }, "");
  };

  function handleBackToTiers() {
    if (window.history.state?.tierOpen) {
      window.history.back();
    } else {
      setSelectedTier(null);
      setSelectedSubCategory("All");
    }
  }

  const handleOpenMagazine = (cat: CatalogueEntry) => {
    setActiveMagazine(cat);
    window.history.pushState({ magazineOpen: true }, "");
  };

  const handleCloseMagazine = () => {
    if (window.history.state?.magazineOpen) {
      window.history.back();
    } else {
      setActiveMagazine(null);
    }
  };


  // Animations for section/tier cards
  useEffect(() => {
    if (!hasAccess || isChecking || selectedTier) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tier-header",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.15 }
      );
      gsap.fromTo(
        ".tier-card",
        { y: 80, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [hasAccess, isChecking, currentSection, selectedTier]);

  // Animations for magazine grid
  useEffect(() => {
    if (!hasAccess || isChecking || (!selectedTier && currentSection === "furniture")) return;
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
  }, [hasAccess, isChecking, currentSection, selectedTier]);


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

  // ─── MAIN SECTIONS SELECTION LANDING VIEW ───
  if (!currentSection) {
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
        <div className="tier-header pt-36 md:pt-44 pb-12 md:pb-16 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto text-center">
            <div className="uppercase tracking-[0.35em] text-[10px] text-lux-gold font-semibold mb-4">
              Private Collection
            </div>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-lux-dark leading-[1.1] mb-5">
              Private <span className="italic text-lux-gold">Catalogue</span>
            </h1>
            <p className="text-lux-text-muted font-sans text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Welcome to your private lookbook portal. Select a collection below to browse our globally sourced design archives.
            </p>
          </div>
        </div>

        {/* Category Cards */}
        <div className="px-6 md:px-12 pb-32">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {mainCategories.map((cat) => {
              const CatIcon = cat.icon;
              
              // Count magazines in this section
              let count = 0;
              if (cat.id === "lighting") {
                count = dynamicCatalogues.filter(c => c.category === "Lighting").length;
              } else if (cat.id === "others") {
                const furnitureCategories = ["Living", "Bed", "Dining", "Office"];
                count = dynamicCatalogues.filter(
                  c => c.category !== "Lighting" && !furnitureCategories.includes(c.category)
                ).length;
              } else if (cat.id === "furniture") {
                const furnitureCategories = ["Living", "Bed", "Dining", "Office"];
                count = dynamicCatalogues.filter(c => furnitureCategories.includes(c.category)).length;
              }

              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectSection(cat.id)}
                  className="tier-card group text-left relative rounded-sm overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]"
                >
                  {/* Background Image */}
                  <div className="relative aspect-[3/4] md:aspect-[2/3] overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                      priority
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 transition-opacity duration-700 group-hover:from-black/90 group-hover:via-black/50" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center mb-6 backdrop-blur-sm bg-white/5 transition-all duration-700 group-hover:border-lux-gold/50 group-hover:bg-lux-gold/10">
                        <CatIcon size={22} className="text-lux-gold" strokeWidth={1.2} />
                      </div>

                      {/* Subtitle */}
                      <span className="text-lux-gold text-[10px] tracking-[0.3em] uppercase font-bold mb-2 block">
                        {cat.subtitle}
                      </span>

                      {/* Title */}
                      <h2 className="font-serif text-3xl md:text-4xl text-white uppercase tracking-wider mb-4 transition-all duration-700 group-hover:tracking-[0.12em]">
                        {cat.title}
                      </h2>

                      {/* Gold divider */}
                      <div className="w-12 h-[1px] bg-lux-gold/40 mb-5 transition-all duration-700 group-hover:w-20 group-hover:bg-lux-gold/80" />

                      {/* Description */}
                      <p className="font-sans text-sm text-white/70 font-light leading-relaxed mb-6 max-w-sm">
                        {cat.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-5">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-semibold">
                          {count} {count === 1 ? "Lookbook" : "Lookbooks"}
                        </span>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-lux-gold font-semibold group-hover:tracking-[0.3em] transition-all duration-500 flex items-center gap-2">
                          Explore
                          <svg className="w-3.5 h-3.5 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ─── FURNITURE TIERS SELECTION VIEW ───
  if (currentSection === "furniture" && !selectedTier) {
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

        {/* Back button and Hero Header */}
        <div className="tier-header pt-36 md:pt-44 pb-12 md:pb-16 px-6 md:px-12">
          <div className="max-w-[1400px] mx-auto">
            <button
              onClick={handleBackToSections}
              className="inline-flex items-center gap-3 text-lux-text-muted hover:text-lux-gold transition-colors duration-500 mb-10 group/back"
            >
              <ArrowLeft size={16} className="transition-transform duration-500 group-hover/back:-translate-x-1" strokeWidth={1.5} />
              <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">
                Back to Sections
              </span>
            </button>

            <div className="text-center">
              <div className="uppercase tracking-[0.35em] text-[10px] text-lux-gold font-semibold mb-4">
                Furniture Collection
              </div>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-lux-dark leading-[1.1] mb-5">
                Choose Your <span className="italic text-lux-gold">Collection</span>
              </h1>
              <p className="text-lux-text-muted font-sans text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Explore our three tiers of luxury furniture, each representing a distinct level of craftsmanship, materiality, and design exclusivity.
              </p>
            </div>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="px-6 md:px-12 pb-32">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {tiers.map((tier) => {
              const TierIcon = tier.icon;
              const furnitureCategories = ["Living", "Bed", "Dining", "Office"];
              const tierMagazineCount = dynamicCatalogues.filter(
                (c) => c.tier.toLowerCase() === tier.id.toLowerCase() && furnitureCategories.includes(c.category)
              ).length;

              return (
                <button
                  key={tier.id}
                  onClick={() => handleSelectTier(tier.id)}
                  className="tier-card group text-left relative rounded-sm overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]"
                >
                  {/* Background Image */}
                  <div className="relative aspect-[3/4] md:aspect-[2/3] overflow-hidden">
                    <Image
                      src={tier.image}
                      alt={tier.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                      priority
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 transition-opacity duration-700 group-hover:from-black/90 group-hover:via-black/50" />

                    {/* Content overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center mb-6 backdrop-blur-sm bg-white/5 transition-all duration-700 group-hover:border-lux-gold/50 group-hover:bg-lux-gold/10">
                        <TierIcon size={22} className="text-lux-gold" strokeWidth={1.2} />
                      </div>

                      {/* Subtitle */}
                      <span className="text-lux-gold text-[10px] tracking-[0.3em] uppercase font-bold mb-2 block">
                        {tier.subtitle}
                      </span>

                      {/* Title */}
                      <h2 className="font-serif text-4xl md:text-5xl text-white uppercase tracking-wider mb-4 transition-all duration-700 group-hover:tracking-[0.15em]">
                        {tier.title}
                      </h2>

                      {/* Gold divider */}
                      <div className="w-12 h-[1px] bg-lux-gold/40 mb-5 transition-all duration-700 group-hover:w-20 group-hover:bg-lux-gold/80" />

                      {/* Description */}
                      <p className="font-sans text-sm text-white/70 font-light leading-relaxed mb-6 max-w-sm">
                        {tier.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-5">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-semibold">
                          {tierMagazineCount} {tierMagazineCount === 1 ? "Lookbook" : "Lookbooks"}
                        </span>
                        <span className="text-[10px] tracking-[0.2em] uppercase text-lux-gold font-semibold group-hover:tracking-[0.3em] transition-all duration-500 flex items-center gap-2">
                          Explore
                          <svg className="w-3.5 h-3.5 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
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

      {/* Header with back button */}
      <div className="cat-header pt-36 md:pt-44 pb-16 md:pb-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Back button */}
          <button
            onClick={headerInfo.onBack}
            className="inline-flex items-center gap-3 text-lux-text-muted hover:text-lux-gold transition-colors duration-500 mb-10 group/back"
          >
            <ArrowLeft size={16} className="transition-transform duration-500 group-hover/back:-translate-x-1" strokeWidth={1.5} />
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">
              {headerInfo.backText}
            </span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="uppercase tracking-[0.35em] text-[10px] text-lux-gold font-semibold mb-4">
                {headerInfo.subtitle}
              </div>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-lux-dark leading-[1.1] mb-5">
                <span className="italic text-lux-gold">{headerInfo.title.split(" ")[0]}</span> {headerInfo.title.substring(headerInfo.title.indexOf(" ") + 1)}
              </h1>
              <p className="text-lux-text-muted font-sans text-base md:text-lg max-w-xl leading-relaxed">
                {headerInfo.description}
              </p>
            </div>

            <div className="flex items-center gap-3 border border-lux-gold/20 px-6 py-4 rounded-sm bg-white/40 backdrop-blur-md self-start lg:self-end">
              <span className="text-[10px] uppercase tracking-[0.2em] text-lux-text-muted font-semibold">
                {filteredCatalogues.length} {filteredCatalogues.length === 1 ? "Lookbook" : "Lookbooks"}
              </span>
            </div>
          </div>

          {/* Sorting / Filter tabs for Furniture */}
          {currentSection === "furniture" && (
            <div className="flex flex-wrap items-center gap-3 mt-12 border-b border-lux-border pb-6">
              {["All", "Living", "Bedroom", "Dining", "Office"].map((subCat) => {
                const isActive = selectedSubCategory === subCat;
                return (
                  <button
                    key={subCat}
                    onClick={() => setSelectedSubCategory(subCat)}
                    className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-500 rounded-sm ${
                      isActive
                        ? "bg-lux-dark text-white shadow-sm"
                        : "bg-white/40 text-lux-text-muted hover:text-lux-gold border border-lux-border/40"
                    }`}
                  >
                    {subCat}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>


      {/* Magazine Grid */}
      <div className="px-6 md:px-12 pb-32">
        <div className="max-w-[1400px] mx-auto">
          {filteredCatalogues.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-full border border-lux-border/40 flex items-center justify-center mb-6">
                <BookOpen size={22} className="text-lux-text-muted/40" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl text-lux-dark mb-3">No Catalogues Yet</h3>
              <p className="text-lux-text-muted font-sans text-sm max-w-md mx-auto">
                There are no catalogues available in the {selectedTier} collection at the moment. Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
                    {cat.category && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-sm border border-white/20">
                        <span className="text-white text-[9px] tracking-[0.2em] uppercase font-semibold">
                          {cat.category}
                        </span>
                      </div>
                    )}
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
          )}
        </div>
      </div>

      {/* Magazine Viewer Modal */}
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
