import { ArrowLeft, FileText, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { askQuestion, getChats, getMessages } from "../services/chat.api";
import { getDocument } from "../services/document.api";
import { PdfViewer } from "../components/PdfViewer";
import { AssistantMarkdown } from "../components/chat/ChatMessage";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/skeleton";

const MIN_CHAT_WIDTH = 320;
const MAX_CHAT_WIDTH = 700;
const THINKING_MESSAGES = [
  "Scanning",
  "Decoding",
  "Mapping",
  "Unfolding",
  "Distilling",
  "Synthesizing",
  "Weaving",
  "Refining",
  "Composing",
];

export function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [chatWidth, setChatWidth] = useState(500);
  const [resizing, setResizing] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState(THINKING_MESSAGES[0]);

  useEffect(() => {
    if (!sending) {
      setThinkingMessage(THINKING_MESSAGES[0]);
      return undefined;
    }

    let messageIndex = 0;
    const intervalId = window.setInterval(() => {
      messageIndex = (messageIndex + 1) % THINKING_MESSAGES.length;
      setThinkingMessage(THINKING_MESSAGES[messageIndex]);
    }, 1400);

    return () => window.clearInterval(intervalId);
  }, [sending]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading, sending]);

  useEffect(() => {
    if (!resizing) return undefined;

    function handlePointerMove(event) {
      const nextWidth = window.innerWidth - event.clientX;
      setChatWidth(
        Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, nextWidth)),
      );
    }

    function handlePointerUp() {
      setResizing(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [resizing]);

  useEffect(() => {
    Promise.all([getChats(), getMessages(chatId)])
      .then(async ([chatResult, messageResult]) => {
        const chat = (chatResult.chats || []).find(
          (item) => item.id === chatId,
        );
        if (!chat) throw new Error("Chat not found");
        const result = await getDocument(chat.document_id);
        setDocument(result.document);
        setMessages(messageResult.messages || []);
      })
      .catch((requestError) =>
        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            "Something went wrong",
        ),
      )
      .finally(() => setLoading(false));
  }, [chatId]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!question.trim() || sending) return;
    const text = question.trim();
    setQuestion("");
    setMessages((current) => [
      ...current,
      { id: `local-${Date.now()}`, role: "user", content: text },
    ]);
    setSending(true);
    try {
      const result = await askQuestion(chatId, text);
      setMessages((current) => [
        ...current,
        {
          id: `answer-${Date.now()}`,
          role: "assistant",
          content: result.answer,
          sources: result.sources,
        },
      ]);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not send your question",
      );
    } finally {
      setSending(false);
    }
  }

  if (error && !document) return <Status error>{error}</Status>;

  return (
    <main
      className={`flex h-dvh min-h-0 flex-col overflow-hidden bg-muted/40 md:min-h-[640px] md:flex-row ${resizing ? "select-none" : ""}`}
    >
      <section className="hidden min-h-0 min-w-0 flex-col border-b border-border md:flex md:h-auto md:flex-1 md:border-b-0 md:border-r">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-3 sm:h-16 sm:px-5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/app")}
            aria-label="Back to documents"
          >
            <ArrowLeft size={18} />
          </Button>
          <FileText size={18} className="text-primary" />
          {document ? (
            <span className="truncate text-sm font-semibold">
              {document.filename}
            </span>
          ) : (
            <Skeleton className="h-4 w-40" />
          )}
        </header>
        <div className="min-h-0 flex-1">
          {document ? (
            <PdfViewer fileUrl={document.file_url} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading PDF...
            </div>
          )}
        </div>
      </section>
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize chat sidebar"
        aria-valuemin={MIN_CHAT_WIDTH}
        aria-valuemax={MAX_CHAT_WIDTH}
        aria-valuenow={chatWidth}
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture?.(event.pointerId);
          setResizing(true);
        }}
        className={`group hidden w-1 shrink-0 cursor-col-resize items-center justify-center bg-border transition-colors hover:bg-primary/40 md:flex ${resizing ? "bg-primary" : ""}`}
      >
        <span className="h-10 w-0.5 rounded-full bg-muted-foreground/50 group-hover:bg-primary" />
      </div>
      <section
        className="flex h-full min-h-0 w-full shrink-0 flex-col bg-background md:h-auto md:w-(--chat-width)"
        style={{ "--chat-width": `${chatWidth}px` }}
      >
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4 sm:h-16 sm:px-5">
          <Sparkles size={18} className="text-primary" />
          <div>
            <h1 className="text-sm font-semibold">ChatPDF</h1>
            <p className="max-w-[min(60vw,20rem)] truncate text-xs text-muted-foreground">
              {document?.filename || "Ask about your PDF"}
            </p>
          </div>
        </header>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
          {loading ? (
            <ChatSkeletons />
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`animate-in fade-in-0 duration-300 motion-reduce:animate-none ${message.role === "user" ? "justify-end text-right slide-in-from-right-2" : "slide-in-from-left-2"} flex items-start gap-3`}
              >
                {message.role === "assistant" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Sparkles size={14} />
                  </div>
                )}
                <div
                  className={`min-w-0 max-w-[82%] wrap-break-word rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "assistant" ? "rounded-tl-md bg-muted" : "rounded-tr-md bg-primary text-primary-foreground"}`}
                >
                  {message.role === "assistant" ? (
                    <AssistantMarkdown content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))
          )}
          {sending && (
            <div
              className="flex items-center gap-1"
              aria-label="Assistant is thinking"
            >
              <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="size-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <span className="size-2 animate-bounce rounded-full bg-primary" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex shrink-0 gap-2 border-t border-border p-3 sm:p-4"
        >
          <Input
            labelClassName="min-w-0 flex-1"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question..."
            disabled={sending}
          />
          <Button
            type="submit"
            size="icon-lg"
            disabled={!question.trim() || sending}
            aria-label="Send question"
          >
            <Send size={18} />
          </Button>
        </form>
      </section>
    </main>
  );
}

function Status({ children, error = false }) {
  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-muted/40 text-sm ${error ? "text-destructive" : "text-muted-foreground"}`}
    >
      {children}
    </div>
  );
}

function ChatSkeletons() {
  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-14 w-3/4 rounded-2xl" />
      </div>
      <div className="flex flex-row-reverse gap-3">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-11 w-2/3 rounded-2xl" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-20 w-4/5 rounded-2xl" />
      </div>
    </div>
  );
}
