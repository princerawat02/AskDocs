import { MoreHorizontal, PanelRightClose } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export function ChatWindow({
  document,
  messages = [],
  messagesLoading,
  onAskQuestion,
  onClose,
}) {
  return (
    <section className="flex w-full shrink-0 flex-col border-l border-slate-200 bg-white lg:w-[390px]">
      <header className="flex h-16 items-center justify-between border-b border-slate-200/80 px-5">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-bold text-slate-800">
            Chat about {document.name.replace(".pdf", "")}
          </h2>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            {messages.length} messages
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Chat options"
          >
            <MoreHorizontal size={18} />
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
            aria-label="Close chat"
          >
            <PanelRightClose size={18} />
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {messagesLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
            Thinking...
          </div>
        )}
      </div>
      <ChatInput onSubmit={onAskQuestion} loading={messagesLoading} />
    </section>
  );
}
