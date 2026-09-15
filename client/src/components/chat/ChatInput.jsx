import { Mic, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/textarea";

export function ChatInput({ onSubmit, loading }) {
  const [value, setValue] = useState("");
  function handleSubmit(event) {
    event.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit(value.trim());
    setValue("");
  }

  return (
    <div className="border-t border-slate-200/80 bg-white p-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-background p-2 shadow-sm focus-within:ring-3 focus-within:ring-ring/20"
      >
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows="2"
          placeholder="Ask anything about this document..."
          className="min-h-16 resize-none border-0 bg-transparent px-2 py-1 leading-6 shadow-none focus-visible:ring-0"
          aria-label="Ask about this document"
        />
        <div className="flex items-center justify-between px-1">
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Attach file"
            >
              <Paperclip size={17} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Use microphone"
            >
              <Mic size={17} />
            </Button>
          </div>
          <Button
            type="submit"
            size="icon-sm"
            disabled={!value.trim() || loading}
            aria-label="Send message"
          >
            <Send size={15} />
          </Button>
        </div>
      </form>
      <p className="mt-2 text-center text-[10px] text-slate-400">
        AI can make mistakes. Check important information.
      </p>
    </div>
  );
}
