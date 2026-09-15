import { Download, Expand, Minus, Plus, RotateCcw } from "lucide-react";

export function PdfViewer({ document }) {
  return (
    <section className="relative flex min-h-0 flex-1 flex-col bg-[#eef1f5]">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <div className="text-xs font-medium text-slate-500">
          Reading mode <span className="mx-1 text-slate-300">/</span>{" "}
          <span className="text-slate-700">{document.name}</span>
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Zoom out"
          >
            <Minus size={15} />
          </button>
          <span className="min-w-12 text-center text-xs font-semibold text-slate-600">
            100%
          </span>
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Zoom in"
          >
            <Plus size={15} />
          </button>
          <span className="mx-1 h-5 w-px bg-slate-200" />
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Reset zoom"
          >
            <RotateCcw size={15} />
          </button>
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Download document"
          >
            <Download size={15} />
          </button>
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Fullscreen"
          >
            <Expand size={15} />
          </button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 justify-center overflow-auto px-4 py-8 md:px-10">
        {document.file_url ? (
          <iframe
            title={document.name}
            src={document.file_url}
            className="h-full min-h-[760px] w-full max-w-[900px] shrink-0 bg-white shadow-[0_8px_35px_rgba(30,41,59,0.1)]"
          />
        ) : (
          <div className="flex min-h-[300px] w-full max-w-[660px] items-center justify-center bg-white text-sm text-slate-500 shadow-sm">
            PDF preview unavailable.
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-4 border-t border-slate-200 bg-white py-3">
        <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">
          ‹ Previous
        </button>
        <span className="text-xs font-medium text-slate-500">
          4 / {document.pages}
        </span>
        <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50">
          Next ›
        </button>
      </div>
    </section>
  );
}
