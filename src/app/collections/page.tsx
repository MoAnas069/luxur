"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { X, ArrowRight, Sparkles, Globe, Compass } from "lucide-react";
import { supabase } from "@/lib/supabase";


gsap.registerPlugin(ScrollTrigger);

// ─── 29 DYNAMIC PRODUCTS ───
interface Product {
  id: string;
  name: string;
  category: "Living" | "Dining" | "Bedroom" | "Lighting";
  description: string;
  image: string;
  materials: string;
  dimensions: string;
  origin: string;
  designer: string;
}

const products: Product[] = [
  {
    id: "prod-1",
    name: "Milano Cascade Chandelier",
    category: "Living",
    description: "A multi-tiered arrangement of hand-polished glass flutes suspended from a satin brass ring, diffusing soft, warm light.",
    image: "/new%20images/product_01.webp",
    materials: "Hand-Blown Glass, Satin Brass, Integrated LED",
    dimensions: "110cm Diameter x 140cm H",
    origin: "Milan, Italy",
    designer: "Studio Castiglione"
  },
  {
    id: "prod-2",
    name: "Aurelia Linear Chandelier",
    category: "Living",
    description: "Sleek architectural design featuring horizontal brass bars with frosted glass globes, perfect for modern high-ceiling spaces.",
    image: "/new%20images/product_02.webp",
    materials: "Solid Brass, Frosted Glass, Adjustable Cable Suspensions",
    dimensions: "160cm W x 45cm D x 85cm H",
    origin: "Tuscany, Italy",
    designer: "Enzo Rossi"
  },
  {
    id: "prod-3",
    name: "Duomo Ring Chandelier",
    category: "Living",
    description: "Concentric brass hoops lined with delicate fluted glass prisms that capture and refract natural light.",
    image: "/new%20images/product_03.webp",
    materials: "Fluted Crystal, Brushed Brass, Dimmable LED",
    dimensions: "120cm Diameter x 95cm H",
    origin: "Brianza, Italy",
    designer: "Marzia Colombo"
  },
  {
    id: "prod-4",
    name: "Brera Double-Tier Chandelier",
    category: "Living",
    description: "A modern classic design showing two tiers of frosted opal glass shades supported by a structural brass framework.",
    image: "/new%20images/product_04.webp",
    materials: "Opal Glass, Satin Brass, Steel Frame",
    dimensions: "100cm Diameter x 120cm H",
    origin: "Rome, Italy",
    designer: "Studio Castiglione"
  },
  {
    id: "prod-5",
    name: "Atelier Rustic Halo Chandelier",
    category: "Dining",
    description: "A rugged yet refined circular chandelier crafted from distressed white oak and hand-forged patinated iron.",
    image: "/new%20images/product_09.webp",
    materials: "Solid French White Oak, Hand-Forged Wrought Iron",
    dimensions: "120cm Diameter x 90cm H",
    origin: "Burgundy, France",
    designer: "Jean-Louis Dupont"
  },
  {
    id: "prod-6",
    name: "Oak & Iron Timber Chandelier",
    category: "Dining",
    description: "A substantial horizontal wood beam chandelier hung by heavy industrial iron chains, featuring Edison bulbs.",
    image: "/new%20images/product_10.webp",
    materials: "Reclaimed Oak, Patinated Wrought Iron, Carbon Filament Bulbs",
    dimensions: "180cm W x 35cm D x 75cm H",
    origin: "Lyon, France",
    designer: "Jean-Louis Dupont"
  },
  {
    id: "prod-7",
    name: "Heritage Cage Chandelier",
    category: "Dining",
    description: "An open architectural iron framework encasing a cluster of candle-style lights, ideal for formal dining.",
    image: "/new%20images/product_11.webp",
    materials: "Charcoal Wrought Iron, Brass Accents",
    dimensions: "85cm W x 85cm D x 115cm H",
    origin: "Ghent, Belgium",
    designer: "Dirk Van Der Meer"
  },
  {
    id: "prod-8",
    name: "Ardennes Ring Chandelier",
    category: "Dining",
    description: "A heavy-gauge circular iron frame supporting exposed glass bulbs, bringing a bold industrial presence.",
    image: "/new%20images/product_12.webp",
    materials: "Blackened Steel, Smoked Glass Covers",
    dimensions: "110cm Diameter x 95cm H",
    origin: "Brussels, Belgium",
    designer: "Dirk Van Der Meer"
  },
  {
    id: "prod-9",
    name: "Baryte Linear Beam Chandelier",
    category: "Dining",
    description: "A minimal hand-finished dark oak beam embedded with downward-facing LED spotlights and accent up-lights.",
    image: "/new%20images/product_13.webp",
    materials: "Ebonized Oak, Blackened Steel Canopy, Precision LEDs",
    dimensions: "200cm W x 15cm D x 12cm H",
    origin: "Antwerp, Belgium",
    designer: "Studio Vandevelde"
  },
  {
    id: "prod-10",
    name: "Verdant Branch Chandelier",
    category: "Dining",
    description: "An artistic representation of tree branches cast in solid bronze, holding tiny sparkling glass leaves.",
    image: "/new%20images/product_14.webp",
    materials: "Cast Bronze, Molded Glass Leaves",
    dimensions: "140cm W x 70cm D x 90cm H",
    origin: "Ardennes, Belgium",
    designer: "Dirk Van Der Meer"
  },
  {
    id: "prod-11",
    name: "Nocturne Smoked Glass Chandelier",
    category: "Bedroom",
    description: "Enveloping arrangement of hand-blown smoked glass globes that emit a moody, intimate glow.",
    image: "/new%20images/product_15.webp",
    materials: "Smoked Murano Glass, Dark Bronze",
    dimensions: "90cm Diameter x 105cm H",
    origin: "Lyon, France",
    designer: "Hélène de Saint-Exupéry"
  },
  {
    id: "prod-12",
    name: "Obsidian Globe Chandelier",
    category: "Bedroom",
    description: "Sleek dark bronze branching arms holding hand-painted charcoal glass spheres that cast dramatic shadows.",
    image: "/new%20images/product_16.webp",
    materials: "Charcoal Glass, Blackened Bronze",
    dimensions: "115cm W x 115cm D x 85cm H",
    origin: "Paris, France",
    designer: "Hélène de Saint-Exupéry"
  },
  {
    id: "prod-13",
    name: "Dusk Alabaster Pendant Chandelier",
    category: "Bedroom",
    description: "A solid dome of Spanish alabaster showing unique natural veining, emitting a soft, diffuse light.",
    image: "/new%20images/product_17.webp",
    materials: "Honed Spanish Alabaster, Dark Brass",
    dimensions: "65cm Diameter x 70cm H",
    origin: "Zurich, Switzerland",
    designer: "Gerrit Hoff"
  },
  {
    id: "prod-14",
    name: "Shadow Dark Brass Chandelier",
    category: "Bedroom",
    description: "Geometric configuration of dark brass pipes with integrated step-dimming for mood setting.",
    image: "/new%20images/product_18.webp",
    materials: "Dark Antique Brass, Integrated Warm Dimming",
    dimensions: "105cm W x 85cm D x 95cm H",
    origin: "Geneva, Switzerland",
    designer: "Gerrit Hoff"
  },
  {
    id: "prod-15",
    name: "Midnight Velvet-Trimmed Chandelier",
    category: "Bedroom",
    description: "A luxurious multi-tiered chandelier featuring custom indigo velvet trim and delicate glass droplets.",
    image: "/new%20images/product_19.webp",
    materials: "Silk Velvet Trim, Crystal Droplets, Bronze Frame",
    dimensions: "80cm Diameter x 110cm H",
    origin: "Paris, France",
    designer: "Hélène de Saint-Exupéry"
  },
  {
    id: "prod-16",
    name: "Somnus Blackened Iron Chandelier",
    category: "Bedroom",
    description: "A minimalist cage-style chandelier made of thin blackened iron wires, creating an airy, light look.",
    image: "/new%20images/product_20.webp",
    materials: "Blackened Iron, Carbon Filament Bulb",
    dimensions: "75cm Diameter x 90cm H",
    origin: "Milan, Italy",
    designer: "Studio Castiglione"
  },
  {
    id: "prod-17",
    name: "Dorset Ribbed Chandelier",
    category: "Bedroom",
    description: "Concentric bands of ribbed glass that wrap around a central light core, casting a soft textured glow.",
    image: "/new%20images/product_21.webp",
    materials: "Ribbed Borosilicate Glass, Antique Brass",
    dimensions: "60cm Diameter x 80cm H",
    origin: "Zurich, Switzerland",
    designer: "Gerrit Hoff"
  },
  {
    id: "prod-18",
    name: "Lumina Sculptural Glass Chandelier",
    category: "Lighting",
    description: "Organic shapes of hand-blown glass cascading in a spiraling formation, resembling frozen drops of water.",
    image: "/new%20images/product_22.webp",
    materials: "Hand-Blown Crystal Glass, Satin Brass Canopy",
    dimensions: "95cm Diameter x 180cm H",
    origin: "Murano, Italy",
    designer: "Pietro Moretti"
  },
  {
    id: "prod-19",
    name: "Aura Brass & Crystal Chandelier",
    category: "Lighting",
    description: "A dazzling display of hand-cut crystal prisms mounted on a polished brass ring, refracting full-spectrum light.",
    image: "/new%20images/product_23.webp",
    materials: "Full-Lead Crystal, Polished Brass",
    dimensions: "120cm Diameter x 100cm H",
    origin: "Murano, Italy",
    designer: "Pietro Moretti"
  },
  {
    id: "prod-20",
    name: "Helios Sunburst Chandelier",
    category: "Lighting",
    description: "A radiant center with slender brass rods radiating outwards, tipped with sparkling crystal points.",
    image: "/new%20images/product_24.webp",
    materials: "Polished Gold Brass, K9 Crystal Points",
    dimensions: "110cm Diameter x 110cm H",
    origin: "Barcelona, Spain",
    designer: "Elena Gual"
  },
  {
    id: "prod-21",
    name: "Nimbus Glass Leaf Chandelier",
    category: "Lighting",
    description: "Overlapping glass leaves that resemble morning frost, suspended from a central chrome trunk.",
    image: "/new%20images/product_25.webp",
    materials: "Frosted Textured Glass, Polished Chrome",
    dimensions: "110cm Diameter x 90cm H",
    origin: "Venice, Italy",
    designer: "Pietro Moretti"
  },
  {
    id: "prod-22",
    name: "Solstice Art Deco Chandelier",
    category: "Lighting",
    description: "A geometric combination of brass frames and crystal panels, paying homage to classic Art Deco luxury.",
    image: "/new%20images/product_26.webp",
    materials: "K9 Crystal Panels, Brushed Gold Frame",
    dimensions: "85cm W x 85cm D x 100cm H",
    origin: "Madrid, Spain",
    designer: "Elena Gual"
  },
  {
    id: "prod-23",
    name: "Nebula Bubble Glass Chandelier",
    category: "Lighting",
    description: "A cluster of delicate hand-blown glass bubbles floating like clouds, reflecting an internal LED glow.",
    image: "/new%20images/product_27.webp",
    materials: "Murano Bubble Glass, Micro-wire Suspension",
    dimensions: "100cm Diameter x 120cm H",
    origin: "Rome, Italy",
    designer: "Elena Gual"
  },
  {
    id: "prod-24",
    name: "Polaris Asymmetric Chandelier",
    category: "Lighting",
    description: "An abstract modern sculpture of crossing brass lines and varying glass sizes, a focal point for double-height spaces.",
    image: "/new%20images/product_28.webp",
    materials: "Satin Brass, Smoked and Clear Glass Globes",
    dimensions: "140cm W x 110cm D x 150cm H",
    origin: "Murano, Italy",
    designer: "Pietro Moretti"
  },
  {
    id: "prod-25",
    name: "Astral Crystal Star Chandelier",
    category: "Lighting",
    description: "A spherical cluster of star-cut crystal prisms that project beautiful light patterns across the room.",
    image: "/new%20images/product_29.webp",
    materials: "Star-Cut Lead Crystal, Polished Nickel Frame",
    dimensions: "90cm Diameter x 90cm H",
    origin: "Venice, Italy",
    designer: "Pietro Moretti"
  }
];

export default function Collections() {
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [showRightClickAlert, setShowRightClickAlert] = useState<boolean>(false);
  const [inquiryName, setInquiryName] = useState<string>("");
  const [inquiryEmail, setInquiryEmail] = useState<string>("");
  const [inquiryRequirements, setInquiryRequirements] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Filter functionality with GSAP transition
  useEffect(() => {
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

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const { data, error } = await supabase
          .from("photos")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching photos from Supabase:", error);
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
      } catch (err) {
        console.error("Unexpected error fetching photos:", err);
      }
    }

    fetchPhotos();
  }, []);

  function mapCategory(dbCat: string): "Living" | "Dining" | "Bedroom" | "Lighting" {
    if (!dbCat) return "Living";
    const c = dbCat.toLowerCase();
    if (c.includes("living")) return "Living";
    if (c.includes("dining")) return "Dining";
    if (c.includes("bed")) return "Bedroom";
    if (c.includes("light")) return "Lighting";
    return "Living";
  }

  const allProducts = [...dynamicProducts, ...products];

  const filteredProducts = selectedCategory === "All"
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

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

  const categories = ["All", "Living", "Dining", "Bedroom", "Lighting"];

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
                Singular <span className="italic text-lux-gold font-light">Chandeliers</span>
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

          {/* Products Grid */}
          <div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setActiveProduct(prod)}
                className="product-item-card group cursor-pointer flex flex-col justify-between h-full bg-white border border-lux-border/40 p-4 rounded-sm hover:shadow-[0_15px_50px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-700"
              >
                {/* Image Wrapper */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-lux-bg mb-6 rounded-sm">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                    onContextMenu={handleContextMenu}
                    loading="lazy"
                  />
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
          <div className="bg-lux-bg-alt border border-lux-border/60 max-w-5xl w-full rounded-sm shadow-2xl overflow-hidden relative grid grid-cols-1 md:grid-cols-12 max-h-[92vh]">
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full border border-lux-dark/10 bg-white/60 backdrop-blur-md flex items-center justify-center text-lux-dark hover:text-lux-gold hover:border-lux-gold hover:rotate-90 transition-all duration-700"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            {/* Left Specs & Inquiry Column (7 cols) */}
            <div className="md:col-span-7 p-8 md:p-12 overflow-y-auto max-h-[92vh]">
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
            <div className="hidden md:block md:col-span-5 h-[92vh] relative overflow-hidden bg-lux-dark">
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                onContextMenu={handleContextMenu}
              />
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
