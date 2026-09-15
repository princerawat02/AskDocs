import { Copy, MoreHorizontal, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { SourceCard } from "./SourceCard";

export function AssistantMarkdown({ content }) {
  return (
    <div className="space-y-3 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-background/80 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:leading-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-950 [&_pre]:p-3 [&_pre]:text-slate-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function ChatMessage({ message }) {
  const assistant = message.role === "assistant";
  const sources = message.sources?.map((page) => ({
    page,
    title: `Page ${page}`,
  }));
  return (
    <div className={`flex gap-3 ${assistant ? "" : "flex-row-reverse"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${assistant ? "bg-slate-900 text-white" : "bg-[#e7d8cc] text-[10px] font-bold text-[#765542]"}`}
      >
        {assistant ? <Sparkles size={14} /> : "PR"}
      </div>
      <div className={`max-w-[88%] ${assistant ? "" : "items-end text-right"}`}>
        <div
          className={`flex items-center gap-2 ${assistant ? "" : "justify-end"}`}
        >
          <span className="text-xs font-semibold text-slate-700">
            {assistant ? "ChatPDF AI" : "You"}
          </span>
          <span className="text-[11px] text-slate-400">{message.time}</span>
        </div>
        <div
          className={`mt-2 rounded-2xl px-4 py-3 text-sm leading-6 ${assistant ? "rounded-tl-md bg-slate-50 text-slate-600" : "rounded-tr-md bg-slate-900 text-white"}`}
        >
          {assistant ? (
            <AssistantMarkdown content={message.content} />
          ) : (
            message.content
          )}
        </div>
        {assistant && sources?.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Sources
            </p>
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => (
                <SourceCard key={source.page} source={source} />
              ))}
            </div>
            <div className="mt-2 flex gap-1 text-slate-400">
              <button
                className="rounded p-1 hover:bg-slate-100"
                aria-label="Copy response"
              >
                <Copy size={13} />
              </button>
              <button
                className="rounded p-1 hover:bg-slate-100"
                aria-label="More response options"
              >
                <MoreHorizontal size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
