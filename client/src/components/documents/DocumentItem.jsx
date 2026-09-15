import { FileText } from "lucide-react";
import { NavLink } from "react-router-dom";

export function DocumentItem({ document, selected }) {
  const iconColors = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    violet: "bg-violet-50 text-violet-600",
    yellow: "bg-amber-50 text-amber-600",
  };
  return (
    <NavLink
      to={`/app/document/${document.id}`}
      className={({ isActive }) =>
        `group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition ${selected || isActive ? "bg-white shadow-sm ring-1 ring-slate-200" : "hover:bg-slate-100/80"}`
      }
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconColors[document.color]}`}
      >
        <FileText size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-700">
          {document.filename}
        </span>
        <span className="mt-0.5 block text-xs text-slate-400">
          Uploaded {new Date(document.created_at).toLocaleDateString()}
        </span>
      </span>
    </NavLink>
  );
}
