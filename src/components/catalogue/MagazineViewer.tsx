"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle } from "lucide-react";

interface MagazineViewerProps {
  title: string;
  /** URL to an HTML magazine file or PDF file */
  src: string;
  onClose: () => void;
}

export default function MagazineViewer({ title, src, onClose }: MagazineViewerProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Normalize src URL with fallback for legacy or missing relative links
  const normalizedSrc = (() => {
    if (!src || src.trim() === "") {
      return "https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/magazines/pdf/volume-10.html";
    }
    if (src.startsWith("/")) {
      if (src.includes("volume-12") || src.includes("volume-13")) {
        return "https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/magazines/pdf/volume-16.html";
      }
      if (src.includes("volume-17")) {
        return "https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/magazines/pdf/volume-53.html";
      }
      return "https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/magazines/pdf/volume-10.html";
    }
    return src;
  })();

  // Fetch HTML text and convert to a text/html Blob URL so browser renders visual HTML instead of plain text code
  useEffect(() => {
    if (!normalizedSrc) return;

    if (normalizedSrc.toLowerCase().endsWith(".pdf")) {
      setBlobUrl(normalizedSrc);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let createdUrl: string | null = null;

    setIsLoading(true);
    setHasError(false);

    fetch(normalizedSrc)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then((htmlText) => {
        if (!isMounted) return;
        const blob = new Blob([htmlText], { type: "text/html;charset=utf-8" });
        createdUrl = URL.createObjectURL(blob);
        setBlobUrl(createdUrl);
      })
      .catch((err) => {
        console.error("Error loading magazine HTML content:", err);
        if (isMounted) setHasError(true);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [normalizedSrc]);

  // Anti-download protections & body scroll lock
  useEffect(() => {
    const blockCtx = (e: MouseEvent) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && ["s", "p", "S", "P", "u", "U"].includes(e.key)) ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
      }
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("contextmenu", blockCtx);
    document.addEventListener("keydown", blockKeys);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("contextmenu", blockCtx);
      document.removeEventListener("keydown", blockKeys);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[100] bg-black/97 flex flex-col overscroll-contain"
      onDragStart={(e) => e.preventDefault()}
      style={{ userSelect: "none", WebkitUserSelect: "none", overscrollBehavior: "contain" } as React.CSSProperties}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/10 z-20 shrink-0">
        <div>
          <h2 className="text-white/90 font-serif text-lg md:text-xl">{title}</h2>
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-sans mt-0.5">
            Protected Content — Private Lookbook
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
          aria-label="Close magazine viewer"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Magazine iframe */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-black/40">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-white/80 gap-3">
            <div className="w-8 h-8 border-2 border-lux-gold/30 border-t-lux-gold rounded-full animate-spin" />
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-lux-gold font-medium">
              Rendering Visual Lookbook...
            </span>
          </div>
        )}

        {hasError ? (
          <div className="text-center p-8 max-w-md z-20">
            <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-serif text-xl mb-2">Publication Unavailable</h3>
            <p className="text-white/60 text-xs font-sans mb-6">
              The requested catalogue volume could not be loaded at this time.
            </p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                setBlobUrl(null);
              }}
              className="px-6 py-2.5 bg-lux-gold text-black uppercase tracking-widest text-[10px] font-semibold rounded-sm hover:bg-white transition-colors"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          blobUrl && (
            <iframe
              src={blobUrl}
              className="w-full h-full border-0"
              style={{ pointerEvents: "auto" }}
              title={title}
            />
          )
        )}

        {/* Anti-download notice */}
        <div className="absolute bottom-4 right-6 text-white/20 text-[9px] tracking-[0.3em] uppercase font-sans z-20 pointer-events-none">
          Luxura Private • Confidential
        </div>
      </div>
    </div>
  );
}
