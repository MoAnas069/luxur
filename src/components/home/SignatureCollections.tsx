"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const collections = [
  { id: 1, title: "The Milano Collection", src: "https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/photos/1780155444048-product-01.webp", width: "w-full md:w-2/3" },
  { id: 2, title: "Oak & Iron", src: "https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/photos/1780155487770-product-09.webp", width: "w-full md:w-1/3" },
  { id: 3, title: "Nocturne", src: "https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/photos/1780155538472-product-15.webp", width: "w-full md:w-1/2" },
  { id: 4, title: "Lumina", src: "https://rkecfnssedbsccpynwwx.supabase.co/storage/v1/object/public/photos/1780155588665-product-22.webp", width: "w-full md:w-1/2" },
];

export default function SignatureCollections() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".collection-card", 
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-32 bg-lux-bg-alt px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <h2 className="font-serif text-5xl md:text-7xl text-lux-dark mb-24">Signature Collections</h2>
        
        <div className="flex flex-wrap gap-y-16 md:gap-x-8">
          {collections.map((item, index) => (
            <div key={item.id} className={`collection-card relative group cursor-pointer overflow-hidden ${item.width} h-[500px] md:h-[700px]`}>
              <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-105">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority={index < 2}
                />
              </div>
              <div className="absolute inset-0 bg-lux-dark/10 transition-opacity duration-700 group-hover:bg-lux-dark/40" />
              <div className="absolute inset-0 p-10 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <h3 className="text-white font-serif text-4xl translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
