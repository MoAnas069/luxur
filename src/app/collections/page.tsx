"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { X, ArrowRight, Sparkles, Globe, Compass, Maximize2 } from "lucide-react";
import { supabase } from "@/lib/supabase";


gsap.registerPlugin(ScrollTrigger);

// ─── 29 DYNAMIC PRODUCTS ───
interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  materials: string;
  dimensions: string;
  origin: string;
  designer: string;
}

// Static fallback products array removed to only use database-driven photos.

export default function Collections() {
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [showRightClickAlert, setShowRightClickAlert] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [inquiryName, setInquiryName] = useState<string>("");
  const [inquiryEmail, setInquiryEmail] = useState<string>("");
  const [inquiryRequirements, setInquiryRequirements] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [modalImageError, setModalImageError] = useState<boolean>(false);

  // Reset modal image error when the active product changes
  useEffect(() => {
    setModalImageError(false);
  }, [activeProduct]);

  // Filter functionality with GSAP transition
  useEffect(() => {
    setVisibleCount(12);
    const ctx = gsap.context(() => {
      const items = galleryRef.current?.querySelectorAll(".product-item-card");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, scale: 0.95, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power2.out",
            overwrite: "auto",
          }
        );
      }
    }, galleryRef);

    return () => ctx.revert();
  }, [selectedCategory]);

  const [dynamicProducts, setDynamicProducts] = useState<Product[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const { data, error } = await supabase
          .from("photos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching photos from Supabase:", error);
          setFetchError(`Supabase fetch failed: ${error.message} (code ${error.code})`);
          return;
        }

        if (data) {
          const mapped: Product[] = data.map((row: any) => ({
            id: `db-${row.id}`,
            name: row.caption || row.title || "Untitled Piece",
            category: mapCategory(row.category),
            description: row.description || "Bespoke piece sourced directly from our global network of ateliers.",
            image: row.image_url,
            materials: row.materials || "Curated Selection",
            dimensions: row.dimensions || "Custom spec on request",
            origin: row.origin || "Global Sourced",
            designer: row.designer || "Luxura Curation"
          }));
          setDynamicProducts(mapped);
        }
      } catch (err: any) {
        console.error("Unexpected error fetching photos:", err);
        setFetchError(`Unexpected error: ${err.message || err}`);
      }
    }

    fetchPhotos();
  }, []);

  function mapCategory(dbCat: string): string {
    if (!dbCat) return "Living";
    const cat = dbCat.trim().toLowerCase();
    if (cat.includes("living")) return "Living";
    if (cat.includes("bedroom") || cat.includes("bed")) return "Bed";
    if (cat.includes("dining")) return "Dining";
    if (cat.includes("office")) return "Office";
    if (cat.includes("lighting") || cat.includes("light")) return "Lighting";
    return dbCat.trim();
  }



  // Only use the images/products uploaded into the database (as requested)
  const combinedProducts = dynamicProducts;

  // Deduplicate products by name and image URL & stable shuffle
  const allProducts = useMemo(() => {
    const deduped: Product[] = [];
    const seenNames = new Set<string>();
    const seenImages = new Set<string>();
    for (const p of combinedProducts) {
      if (!p.image || p.image.trim() === "") continue;
      const nameKey = p.name.trim().toLowerCase();
      const imgKey = p.image.trim().toLowerCase();
      if (!seenNames.has(nameKey) && !seenImages.has(imgKey)) {
        seenNames.add(nameKey);
        seenImages.add(imgKey);
        deduped.push(p);
      }
    }

    // Shuffle using Fisher-Yates
    const shuffled = [...deduped];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [dynamicProducts]);

  const filteredProducts = (selectedCategory === "All"
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory)
  ).filter(p => !imageErrors[p.id]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = filteredProducts.length > visibleCount;

  // Disabling context menu on images (Digital Asset Protection)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowRightClickAlert(true);
    setTimeout(() => setShowRightClickAlert(false), 3000);
  };

  // Submitting the inquiry form
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim() || !activeProduct) return;

    setIsSubmitting(true);

    const message = `Hello Luxura Team,

I would like to request a bespoke commission for the following product:
- Product: ${activeProduct.name}
- Category: ${activeProduct.category}
- Name: ${inquiryName}
- Email: ${inquiryEmail}
- Requirements: ${inquiryRequirements || "None"}`;

    const waUrl = `https://wa.me/14039717695?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    // Mockup success for demo
    setSubmitSuccess(true);
    // Success GSAP micro-animation
    gsap.fromTo(
      ".success-card-content",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
    setIsSubmitting(false);
  };

  // Reset form when modal closes
  const closeModal = () => {
    setActiveProduct(null);
    setSubmitSuccess(false);
    setInquiryName("");
    setInquiryEmail("");
    setInquiryRequirements("");
  };

  const categories = ["All", ...Array.from(new Set(allProducts.map(p => p.category)))];

  return (
    <div className="bg-lux-bg min-h-screen relative overflow-hidden">
      {/* Subtle Grain Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="pt-36 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        {/* ─── DYNAMIC PRODUCT SHOWCASE SECTION ─── */}
        <div className="pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <span className="uppercase tracking-[0.35em] text-[10px] text-lux-gold font-semibold mb-4 block">
                Bespoke Catalog
              </span>
              <h2 className="font-serif text-4xl md:text-6xl text-lux-dark">
                Curated <span className="italic text-lux-gold font-light">Collections</span>
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-4 border-b border-lux-border/60 pb-2">
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
          </div>

          {/* Diagnostics and Loading States */}
          {fetchError && (
            <div className="py-10 px-6 bg-red-50/10 border border-red-500/20 rounded-sm text-center mb-12 max-w-2xl mx-auto">
              <div className="w-10 h-10 rounded-full border border-red-500/20 flex items-center justify-center mx-auto mb-4 bg-red-500/5">
                <span className="text-red-500 text-sm font-semibold">!</span>
              </div>
              <h4 className="font-serif text-lg text-lux-dark mb-2">Collection Access Restricted</h4>
              <p className="font-sans text-xs text-red-600 font-medium mb-1">
                {fetchError}
              </p>
              <p className="font-sans text-[11px] text-lux-text-muted">
                Please check your network connection or verify Supabase integration settings.
              </p>
            </div>
          )}

          {!fetchError && dynamicProducts.length === 0 && (
            <div className="py-24 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full border border-lux-gold/20 flex items-center justify-center mx-auto mb-4 bg-lux-bg-alt">
                <Sparkles size={16} className="text-lux-gold animate-pulse" />
              </div>
              <h4 className="font-serif text-lg text-lux-dark mb-2">Connecting to Atelier Vault</h4>
              <p className="font-sans text-xs text-lux-text-muted leading-relaxed">
                Securing a direct connection to our global workshop databases. Loading hand-curated pieces...
              </p>
            </div>
          )}

          {/* Products Grid */}
          <div ref={galleryRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
            {displayedProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setActiveProduct(prod)}
                className="product-item-card group cursor-pointer flex flex-col justify-between h-full bg-white border border-lux-border/40 p-3 sm:p-4 rounded-sm hover:shadow-[0_15px_50px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-[transform,box-shadow,border-color,background-color] duration-700"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-lux-bg mb-4 sm:mb-6 rounded-sm group/cardimg">
                  <img
                    src={imageErrors[prod.id] ? "/images/curated_space_1778847129791.webp" : prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                    onContextMenu={handleContextMenu}
                    onError={() => {
                      setImageErrors((prev) => ({ ...prev, [prod.id]: true }));
                    }}
                  />
                  {/* Zoom button on hover */}
                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover/cardimg:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent opening details modal
                        setLightboxImage(imageErrors[prod.id] ? "/images/curated_space_1778847129791.webp" : prod.image);
                      }}
                      className="w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm border border-lux-border/40 flex items-center justify-center text-lux-dark hover:text-lux-gold shadow-md hover:scale-105 transition-all duration-300"
                      title="View Full Photo"
                    >
                      <Maximize2 size={13} />
                    </button>
                  </div>
                  {/* Subtle hover zoom overlay */}
                  <div className="absolute inset-0 bg-lux-dark/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Product Text Info */}
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <span className="text-[9px] uppercase tracking-widest text-lux-gold font-semibold">
                      {prod.category}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-lux-text-muted/60 font-sans">
                      {prod.origin.split(",")[0]}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-lux-dark mb-2 group-hover:text-lux-gold transition-colors duration-500">
                    {prod.name}
                  </h3>
                  <p className="font-sans text-xs text-lux-text-muted font-light leading-relaxed line-clamp-2 mb-6">
                    {prod.description}
                  </p>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-lux-border/40 mt-auto">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-lux-gold">
                    Private Inquiry
                  </span>
                  <span className="text-[10px] text-lux-text-muted/40 uppercase tracking-widest font-sans font-semibold group-hover:translate-x-1 group-hover:text-lux-gold transition-all duration-500">
                    View Specs →
                  </span>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="col-span-full flex justify-center mt-12 mb-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="px-8 py-4 border border-lux-gold/30 hover:border-lux-gold bg-white hover:bg-lux-dark text-lux-dark hover:text-white text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-700 rounded-sm shadow-sm flex items-center gap-3 group"
                >
                  Load More Masterpieces
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── DIGITAL ASSET PROTECTION ALERT ─── */}
      {showRightClickAlert && (
        <div className="fixed bottom-10 right-10 z-[100] px-6 py-4 bg-lux-dark border border-lux-gold/30 text-white rounded-sm shadow-2xl flex items-center gap-3 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-lux-gold animate-pulse" />
          <span className="font-sans text-xs tracking-widest uppercase font-semibold text-white/90">
            Private Collection • Digital Asset Protection
          </span>
        </div>
      )}

      {/* ─── LUXURY PRODUCT DETAILS MODAL ─── */}
      {activeProduct && (
        <div className="fixed inset-0 z-[100] bg-lux-dark/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          {/* Main Modal Panel */}
          <div className="bg-lux-bg-alt border border-lux-border/60 max-w-5xl w-full rounded-sm shadow-2xl overflow-hidden relative flex flex-col md:grid md:grid-cols-12 h-[92vh] md:h-auto max-h-[92vh]">
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-10 h-10 rounded-full border border-lux-dark/10 bg-white/60 backdrop-blur-md flex items-center justify-center text-lux-dark hover:text-lux-gold hover:border-lux-gold hover:rotate-90 transition-all duration-700"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {/* Mobile Image (visible only on mobile) */}
            <div 
              className="block md:hidden w-full h-[35vh] relative overflow-hidden bg-lux-dark shrink-0 cursor-zoom-in group/img"
              onClick={() => setLightboxImage(modalImageError ? "/images/curated_space_1778847129791.webp" : activeProduct.image)}
            >
              <img
                src={modalImageError ? "/images/curated_space_1778847129791.webp" : activeProduct.image}
                alt={activeProduct.name}
                className="w-full h-full object-cover"
                onContextMenu={handleContextMenu}
                onError={() => setModalImageError(true)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
                <span className="px-3 py-1.5 border border-white/30 bg-black/55 backdrop-blur-sm text-white text-[9px] tracking-[0.2em] uppercase font-semibold rounded-sm shadow-md">
                  View Full Screen
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Left Specs & Inquiry Column (7 cols) */}
            <div className="flex-1 md:col-span-7 p-6 sm:p-8 md:p-12 overflow-y-auto min-h-0 md:max-h-[92vh]">
              <span className="uppercase tracking-[0.35em] text-[9px] text-lux-gold font-semibold mb-4 block">
                Singular Specimen
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-lux-dark mb-4 leading-tight">
                {activeProduct.name}
              </h2>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-xs font-sans text-lux-text-muted">
                <div className="flex items-center gap-2">
                  <Compass size={13} className="text-lux-gold" />
                  <span>Designer: <strong className="text-lux-dark font-medium">{activeProduct.designer}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={13} className="text-lux-gold" />
                  <span>Origin: <strong className="text-lux-dark font-medium">{activeProduct.origin}</strong></span>
                </div>
              </div>
              
              <p className="font-sans text-base text-lux-text-muted font-light leading-relaxed mb-10 border-b border-lux-border pb-8">
                {activeProduct.description}
              </p>

              {/* Technical Specifications */}
              <div className="mb-12">
                <h4 className="font-serif text-lg text-lux-dark mb-6">Technical Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="border-l border-lux-gold/30 pl-4">
                    <span className="text-[10px] uppercase tracking-widest text-lux-text-muted/60 block mb-1">
                      Materials
                    </span>
                    <span className="text-sm font-sans font-light text-lux-dark">
                      {activeProduct.materials}
                    </span>
                  </div>
                  <div className="border-l border-lux-gold/30 pl-4">
                    <span className="text-[10px] uppercase tracking-widest text-lux-text-muted/60 block mb-1">
                      Dimensions
                    </span>
                    <span className="text-sm font-sans font-light text-lux-dark">
                      {activeProduct.dimensions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inquiry Section / Submission Form */}
              <div className="border-t border-lux-border pt-10 mt-6">
                {!submitSuccess ? (
                  <div>
                    <div className="flex items-center gap-2.5 mb-6">
                      <Sparkles size={16} className="text-lux-gold animate-pulse" />
                      <h4 className="font-serif text-lg text-lux-dark">Request Bespoke Commission</h4>
                    </div>
                    
                    <form onSubmit={handleInquirySubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[9px] uppercase tracking-widest text-lux-text-muted block mb-2 font-semibold">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            value={inquiryName}
                            onChange={(e) => setInquiryName(e.target.value)}
                            placeholder="Your name"
                            className="w-full bg-white border border-lux-border/60 px-4 py-3 font-sans text-sm text-lux-dark focus:outline-none focus:ring-1 focus:ring-lux-gold/30 focus:border-lux-gold/20 transition-all duration-500 rounded-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase tracking-widest text-lux-text-muted block mb-2 font-semibold">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={inquiryEmail}
                            onChange={(e) => setInquiryEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full bg-white border border-lux-border/60 px-4 py-3 font-sans text-sm text-lux-dark focus:outline-none focus:ring-1 focus:ring-lux-gold/30 focus:border-lux-gold/20 transition-all duration-500 rounded-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-lux-text-muted block mb-2 font-semibold">
                          Custom Requirements (Optional)
                        </label>
                        <textarea
                          rows={3}
                          value={inquiryRequirements}
                          onChange={(e) => setInquiryRequirements(e.target.value)}
                          placeholder="E.g., custom sizing, leather selections, spatial context..."
                          className="w-full bg-white border border-lux-border/60 px-4 py-3 font-sans text-sm text-lux-dark focus:outline-none focus:ring-1 focus:ring-lux-gold/30 focus:border-lux-gold/20 transition-all duration-500 rounded-sm resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-lux-dark text-white uppercase tracking-[0.2em] text-[10px] font-semibold hover:bg-lux-gold transition-colors duration-700 rounded-sm flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isSubmitting ? "Transmitting Request..." : "Submit Private Commission Inquiry"}
                        {!isSubmitting && <ArrowRight size={13} />}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="success-card-content p-8 bg-lux-bg border border-lux-gold/30 rounded-sm text-center">
                    <div className="w-12 h-12 rounded-full border border-lux-gold/20 flex items-center justify-center mx-auto mb-4 bg-lux-bg-alt">
                      <Sparkles size={18} className="text-lux-gold" />
                    </div>
                    <h5 className="font-serif text-xl text-lux-dark mb-2">Request Catalogued</h5>
                    <p className="font-sans text-xs text-lux-text-muted font-light leading-relaxed max-w-sm mx-auto mb-6">
                      Your inquiry has been successfully transmitted. A personal Luxura curator will review your requirements and contact you within 24 hours.
                    </p>
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 bg-lux-dark text-white text-[10px] tracking-widest uppercase font-semibold hover:bg-lux-gold transition-colors duration-500 rounded-sm"
                    >
                      Return to Gallery
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Image Column (5 cols) */}
            <div 
              className="hidden md:block md:col-span-5 h-[92vh] relative overflow-hidden bg-lux-dark cursor-zoom-in group/img"
              onClick={() => setLightboxImage(modalImageError ? "/images/curated_space_1778847129791.webp" : activeProduct.image)}
            >
              <img
                src={modalImageError ? "/images/curated_space_1778847129791.webp" : activeProduct.image}
                alt={activeProduct.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-105"
                onContextMenu={handleContextMenu}
                onError={() => setModalImageError(true)}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
                <span className="px-4 py-2 border border-white/30 bg-black/55 backdrop-blur-sm text-white text-[10px] tracking-[0.2em] uppercase font-semibold rounded-sm shadow-md">
                  View Full Screen
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-10 left-10 text-white">
                <span className="text-[9px] uppercase tracking-widest text-lux-gold font-semibold block mb-1">
                  Private Collection
                </span>
                <span className="text-xs font-sans tracking-wide font-light text-white/80">
                  Copyright © Luxura Group LLC
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[120] bg-lux-dark/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 z-[130] w-12 h-12 rounded-full border border-white/10 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300"
          >
            <X size={20} />
          </button>
          
          <div className="relative max-w-full max-h-full flex items-center justify-center animate-fade-in">
            <img
              src={lightboxImage}
              alt="Full view"
              className="max-w-[95vw] max-h-[90vh] object-contain select-none shadow-2xl rounded-sm"
              onContextMenu={handleContextMenu}
            />
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes lineExpand {
          0% { width: 0; }
          100% { width: 100%; }
        }
        .animate-line-expand {
          animation: lineExpand 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}
