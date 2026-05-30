"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface MagazineViewerProps {
  title: string;
  /** URL to an HTML magazine file (e.g. /magazines/volume-1.html) */
  src: string;
  onClose: () => void;
}

export default function MagazineViewer({ title, src, onClose }: MagazineViewerProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Anti-download protections
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

  useEffect(() => {
    if (src.toLowerCase().endsWith(".pdf")) return;

    setIsLoading(true);
    setError("");
    setHtmlContent("");

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        setHtmlContent(text);
      })
      .catch((err) => {
        console.error("Error fetching magazine HTML:", err);
        setError("Failed to load magazine content.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [src]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/97 flex flex-col"
      onDragStart={(e) => e.preventDefault()}
      style={{ userSelect: "none", WebkitUserSelect: "none" } as React.CSSProperties}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/5 z-20 shrink-0">
        <div>
          <h2 className="text-white/90 font-serif text-lg md:text-xl">{title}</h2>
          <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-sans mt-0.5">
            Protected Content — View Only
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Magazine iframe */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {src.toLowerCase().endsWith(".pdf") ? (
          <iframe
            src={src}
            className="w-full h-full border-0"
            style={{ pointerEvents: "auto" }}
            title={title}
          />
        ) : isLoading ? (
          <div className="text-white/70 font-sans text-sm flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
            Loading publication...
          </div>
        ) : error ? (
          <div className="text-red-400 font-sans text-sm">{error}</div>
        ) : (
          <iframe
            srcDoc={htmlContent}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            style={{ pointerEvents: "auto" }}
            title={title}
          />
        )}

        {/* Anti-download notice */}
        <div className="absolute bottom-4 right-6 text-white/10 text-[9px] tracking-[0.3em] uppercase font-sans z-20 pointer-events-none">
          Luxura Private
        </div>
      </div>
    </div>
  );
}

