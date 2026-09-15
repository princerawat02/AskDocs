import { FileQuestion, SearchX } from "lucide-react";

export function EmptyState({ type = "document", title, description }) {
  const Icon = type === "search" ? SearchX : FileQuestion;
  return (
    <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon size={20} />
      </div>
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}
