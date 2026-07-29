"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, RefreshCw, Mail, Search, CheckCircle, Clock, MessageSquare, ArrowLeft, Filter, ExternalLink } from "lucide-react";

interface ProductInquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  productName: string;
  productCategory: string;
  productImage: string;
  requirements: string;
  status: string;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ProductInquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/product-inquiry");
      const data = await res.json();
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error("Error fetching product inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/product-inquiry", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const categories = ["All", ...Array.from(new Set(inquiries.map((i) => i.productCategory)))];

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.requirements.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "All" || inq.productCategory === selectedCategory;
    const matchesStatus = selectedStatus === "All" || inq.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalNew = inquiries.filter((i) => i.status === "New").length;
  const totalInProgress = inquiries.filter((i) => i.status === "In Progress" || i.status === "Contacted").length;
  const totalCompleted = inquiries.filter((i) => i.status === "Completed").length;

  return (
    <div className="min-h-screen bg-lux-bg text-lux-dark pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background Subtle Grain */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="max-w-[1500px] mx-auto relative z-10">
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-lux-border pb-8">
          <div>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-lux-text-muted hover:text-lux-gold text-xs uppercase tracking-widest font-semibold mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Collections
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-lux-gold/10 border border-lux-gold/30 text-lux-gold text-[10px] tracking-[0.25em] uppercase font-bold rounded-sm">
                Concierge Portal
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-lux-dark">
              Bespoke <span className="italic text-lux-gold font-light">Product Inquiries</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchInquiries}
              disabled={loading}
              className="px-5 py-3 bg-white border border-lux-border/60 hover:border-lux-gold text-lux-dark text-xs uppercase tracking-widest font-semibold rounded-sm transition-all duration-500 flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-lux-gold" : "text-lux-text-muted"} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Metrics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-lux-border/60 p-6 rounded-sm shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-lux-text-muted/70 block mb-1 font-semibold">
                Total Submissions
              </span>
              <span className="font-serif text-3xl text-lux-dark">{inquiries.length}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-lux-bg-alt border border-lux-gold/20 flex items-center justify-center">
              <MessageSquare size={20} className="text-lux-gold" />
            </div>
          </div>

          <div className="bg-white border border-lux-border/60 p-6 rounded-sm shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-lux-gold block mb-1 font-semibold">
                New & Unread
              </span>
              <span className="font-serif text-3xl text-lux-gold">{totalNew}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-lux-gold/10 border border-lux-gold/30 flex items-center justify-center">
              <Sparkles size={20} className="text-lux-gold" />
            </div>
          </div>

          <div className="bg-white border border-lux-border/60 p-6 rounded-sm shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-blue-600 block mb-1 font-semibold">
                In Review / Contacted
              </span>
              <span className="font-serif text-3xl text-lux-dark">{totalInProgress}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-white border border-lux-border/60 p-6 rounded-sm shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-emerald-600 block mb-1 font-semibold">
                Completed Commissions
              </span>
              <span className="font-serif text-3xl text-lux-dark">{totalCompleted}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CheckCircle size={20} className="text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Filter Bar & Controls */}
        <div className="bg-white border border-lux-border/60 p-6 rounded-sm shadow-sm mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-lux-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client name, email, or product..."
              className="w-full bg-lux-bg border border-lux-border/60 pl-11 pr-4 py-3 font-sans text-xs text-lux-dark focus:outline-none focus:border-lux-gold rounded-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-lux-gold" />
              <span className="text-[10px] uppercase tracking-widest text-lux-text-muted font-semibold">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-lux-bg border border-lux-border/60 px-3 py-2 text-xs font-sans text-lux-dark rounded-sm focus:outline-none focus:border-lux-gold"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-lux-text-muted font-semibold">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-lux-bg border border-lux-border/60 px-3 py-2 text-xs font-sans text-lux-dark rounded-sm focus:outline-none focus:border-lux-gold"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries Cards Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-lux-gold/30 border-t-lux-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="font-sans text-xs uppercase tracking-widest text-lux-text-muted font-medium">
              Fetching Product Inquiries...
            </p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="bg-white border border-lux-border/60 py-20 px-6 text-center rounded-sm max-w-xl mx-auto shadow-sm">
            <MessageSquare size={32} className="text-lux-gold/40 mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-lux-dark mb-2">No Inquiries Found</h3>
            <p className="font-sans text-xs text-lux-text-muted max-w-sm mx-auto mb-6">
              {searchTerm || selectedCategory !== "All" || selectedStatus !== "All"
                ? "No product inquiries matched your current search filters."
                : "No bespoke product commission requests have been submitted yet."}
            </p>
            {(searchTerm || selectedCategory !== "All" || selectedStatus !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedStatus("All");
                }}
                className="px-6 py-2.5 bg-lux-dark text-white text-[10px] uppercase tracking-widest font-semibold rounded-sm hover:bg-lux-gold transition-colors"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredInquiries.map((inq) => {
              const formattedDate = new Date(inq.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={inq.id}
                  className="bg-white border border-lux-border/60 p-6 md:p-8 rounded-sm shadow-sm hover:shadow-md transition-all duration-500 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Row: Product Info & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-lux-border/40 mb-6">
                      <div className="flex items-center gap-4">
                        {/* Product Image Thumbnail */}
                        <div className="w-16 h-16 relative bg-lux-bg-alt rounded-sm overflow-hidden border border-lux-border/60 shrink-0">
                          <img
                            src={inq.productImage || "/images/curated_space_1778847129791.webp"}
                            alt={inq.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/curated_space_1778847129791.webp";
                            }}
                          />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest text-lux-gold font-bold block mb-0.5">
                            {inq.productCategory}
                          </span>
                          <h3 className="font-serif text-xl text-lux-dark leading-tight">{inq.productName}</h3>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="shrink-0">
                        <select
                          value={inq.status}
                          disabled={updatingId === inq.id}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-sm border cursor-pointer focus:outline-none transition-colors ${
                            inq.status === "New"
                              ? "bg-lux-gold/10 border-lux-gold/30 text-lux-gold"
                              : inq.status === "Completed"
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                              : "bg-blue-50 border-blue-300 text-blue-700"
                          }`}
                        >
                          <option value="New">NEW</option>
                          <option value="In Progress">IN PROGRESS</option>
                          <option value="Completed">COMPLETED</option>
                        </select>
                      </div>
                    </div>

                    {/* Client Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-lux-bg/60 p-4 rounded-sm border border-lux-border/40">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-lux-text-muted/70 block mb-0.5 font-semibold">
                          Client Name
                        </span>
                        <span className="font-serif text-base text-lux-dark font-medium">{inq.clientName}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-lux-text-muted/70 block mb-0.5 font-semibold">
                          Client Email
                        </span>
                        <a
                          href={`mailto:${inq.clientEmail}?subject=Regarding your inquiry for ${encodeURIComponent(inq.productName)}`}
                          className="font-sans text-xs text-lux-gold hover:underline flex items-center gap-1.5 font-medium"
                        >
                          <Mail size={12} />
                          {inq.clientEmail}
                        </a>
                      </div>
                    </div>

                    {/* Custom Requirements Text */}
                    <div className="mb-6">
                      <span className="text-[9px] uppercase tracking-widest text-lux-text-muted/70 block mb-2 font-semibold">
                        Bespoke Requirements / Specifications
                      </span>
                      <p className="font-sans text-xs text-lux-dark/80 font-light leading-relaxed bg-white p-4 border border-lux-border/50 rounded-sm whitespace-pre-wrap">
                        {inq.requirements || "No custom specifications provided."}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Timestamp & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-lux-border/40 text-[10px] text-lux-text-muted">
                    <div className="flex items-center gap-1.5 font-sans">
                      <Clock size={12} className="text-lux-gold" />
                      <span>{formattedDate}</span>
                    </div>

                    <a
                      href={`mailto:${inq.clientEmail}?subject=Luxura Concierge: ${encodeURIComponent(inq.productName)} Inquiry&body=Dear ${encodeURIComponent(inq.clientName)},\n\nThank you for requesting a bespoke commission for ${encodeURIComponent(inq.productName)}.\n\nBest regards,\nLuxura Concierge Team`}
                      className="px-4 py-2 bg-lux-dark text-white uppercase tracking-widest font-semibold hover:bg-lux-gold transition-colors duration-500 rounded-sm flex items-center gap-2"
                    >
                      <Mail size={11} /> Reply via Email
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
