import * as React from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"

export const BANNER_COLORS = [
  { name: "Mint",  value: "bg-[#e8f9ed]", preview: "#e8f9ed" },
  { name: "Peach", value: "bg-[#fdf0e8]", preview: "#fdf0e8" },
  { name: "Sky",   value: "bg-[#e8f4f9]", preview: "#e8f4f9" },
  { name: "Warm",  value: "bg-[#fdf6e6]", preview: "#fdf6e6" },
  { name: "Lav",   value: "bg-[#f0e8f9]", preview: "#f0e8f9" },
  { name: "Slate", value: "bg-slate-50",   preview: "#f8fafc" },
]

export const LEVEL_LABELS = ["Top-Level Category", "Sub-Category (L2)", "Sub-Sub-Category (L3)"]
export const LEVEL_COLORS = ["text-primary", "text-violet-600", "text-rose-500"]
export const LEVEL_BG     = ["bg-primary/10", "bg-violet-100", "bg-rose-100"]

export function getName(cat: any, lang: string = 'en') {
  if (typeof cat.name === 'object' && cat.name !== null) {
    return cat.name[lang] || cat.name['en'] || ""
  }
  return cat.name || ""
}

export function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-in slide-in-from-bottom-4 ${
      type === "success" ? "bg-emerald-600 text-white" : "bg-destructive text-white"
    }`}>
      {type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {msg}
    </div>
  )
}

export function LevelBadge({ level, label }: { level: number, label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${LEVEL_BG[level]} ${LEVEL_COLORS[level]}`}>
      {label}
    </span>
  )
}
