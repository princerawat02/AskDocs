import { BookOpen, ChevronRight } from "lucide-react";

export function SourceCard({ source }) {
  return (
    <button className="flex min-w-[160px] flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:border-blue-200 hover:bg-blue-50/30">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <BookOpen size={14} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-wide text-blue-600">
          Page {source.page}
        </span>
        <span className="block truncate text-xs font-semibold text-slate-600">
          {source.title}
        </span>
      </span>
      <ChevronRight size={14} className="text-slate-300" />
    </button>
  );
}
