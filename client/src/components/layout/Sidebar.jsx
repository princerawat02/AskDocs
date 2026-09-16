import { FileText, LogOut, Plus, Sparkles, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/Button";

export function Sidebar({
  documents,
  chats,
  user,
  onNewChat,
  onLogout,
  open,
  onClose,
}) {
  const displayName =
    user?.name?.trim() || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex w-72 -translate-x-full flex-col border-r border-slate-200 bg-[#fbfcfe] transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : ""}`}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-5">
        <Link
          to="/app"
          className="flex items-center gap-2.5"
          aria-label="Go to ChatPDF home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Sparkles size={16} />
          </span>
          <span className="text-[17px] font-bold tracking-tight text-slate-900">
            ChatPDF
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </Button>
      </div>
      <div className="p-4">
        <Button className="w-full justify-start" onClick={onNewChat}>
          <Plus size={17} /> New Chat
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3">
        <SectionTitle>My Documents</SectionTitle>
        <div className="space-y-1">
          {documents.map((document) => (
            <NavLink
              key={document.id}
              to={`/app/document/${document.id}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-2.5 py-2.5 ${isActive ? "bg-white shadow-sm ring-1 ring-slate-200" : "hover:bg-slate-100/80"}`
              }
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FileText size={17} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-700">
                  {document.name}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {document.updated}
                </span>
              </span>
            </NavLink>
          ))}
        </div>
        <SectionTitle>Recent Chats</SectionTitle>
        <div className="space-y-1">
          {chats.map((chat) => (
            <NavLink
              key={chat.id}
              to={`/app/chat/${chat.id}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-2.5 py-2 ${isActive ? "bg-slate-100" : "hover:bg-slate-100/80"}`
              }
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <FileText size={15} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-slate-600">
                  {chat.title}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {chat.updated}
                </span>
              </span>
            </NavLink>
          ))}
        </div>
      </div>
      <div className="border-t border-slate-200/80 p-3">
        <div className="flex items-center gap-3 rounded-xl p-2">
          <Avatar className="size-9 ring-2 ring-sky-100 after:border-slate-900/10">
            <AvatarFallback className="bg-slate-900 text-xs font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700">
              {displayName}
            </p>
            <p className="truncate text-xs text-slate-400">
              {user?.email || "Your account"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onLogout}
            aria-label="Log out"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </aside>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="mb-2 mt-5 px-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
      {children}
    </p>
  );
}
