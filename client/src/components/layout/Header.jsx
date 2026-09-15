import { Menu, PanelRightClose } from "lucide-react";
import { Button } from "../ui/Button";

export function Header({ document, onOpenSidebar, onToggleChat }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={19} />
        </Button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <span className="text-xs font-bold">PDF</span>
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold text-slate-800">
            {document.name}
          </h1>
          <p className="text-xs text-slate-400">Last opened today</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 sm:inline-flex">
          Page 4 of {document.pages}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onToggleChat}
          aria-label="Toggle chat"
        >
          <PanelRightClose size={18} />
        </Button>
      </div>
    </header>
  );
}
