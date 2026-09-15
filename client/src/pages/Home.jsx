import { FileText, FileUp, LogOut, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { getCurrentUser, logoutUser } from "../services/auth.api";
import { createChat, getChats } from "../services/chat.api";
import { getDocuments, uploadDocument } from "../services/document.api";

export function Home() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [documents, setDocuments] = useState(null);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getDocuments(), getChats(), getCurrentUser()])
      .then(([documentResult, chatResult, userResult]) => {
        setDocuments(documentResult.documents || []);
        setChats(chatResult.chats || []);
        setUser(userResult.user || userResult);
      })
      .catch((requestError) => {
        setDocuments([]);
        setError(
          requestError.response?.data?.message || "Could not load documents",
        );
      });
  }, []);

  async function openDocument(documentId) {
    setLoading(true);
    setError("");
    try {
      const existingChat = chats.find(
        (chat) => chat.document_id === documentId,
      );
      if (existingChat) {
        navigate(`/app/chat/${existingChat.id}`);
        return;
      }
      const result = await createChat(documentId);
      navigate(`/app/chat/${result.chat.id}`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not open document",
      );
      setLoading(false);
    }
  }

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const uploadResult = await uploadDocument(file);
      const chatResult = await createChat(uploadResult.documentId);
      navigate(`/app/chat/${chatResult.chat.id}`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not upload document",
      );
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logoutUser();
    navigate("/login");
  }

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Opening document...
      </div>
    );

  const userName = user?.name || "Signed-in user";
  const userEmail = user?.email || user?.userId || "";
  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/70 bg-card/60 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles size={15} />
            </span>
            <span className="font-semibold tracking-tight">ChatPDF</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Avatar className="size-8">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </>
            ) : (
              <div className="hidden space-y-1 text-right sm:block">
                <Skeleton className="ml-auto h-3 w-24" />
                <Skeleton className="ml-auto h-2.5 w-32" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              aria-label="Log out"
            >
              <LogOut />
            </Button>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-sky-400">
            Your reading workspace
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Chat with your PDFs
          </h1>
          <p className="mt-4 text-muted-foreground">
            Upload a document, then ask questions grounded in its pages.
          </p>
          <Button
            size="lg"
            className="mt-7"
            onClick={() => inputRef.current?.click()}
          >
            <FileUp /> Upload PDF
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFile}
          className="hidden"
        />
        {documents === null ? (
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Card>
              <CardContent className="space-y-0 p-0">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="flex items-center gap-4 px-5 py-4">
                    <Skeleton className="size-9 rounded-lg" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ) : (
          documents.length > 0 && (
            <div className="mx-auto mt-16 max-w-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Documents</h2>
                <span className="text-xs text-muted-foreground">
                  {documents.length} files
                </span>
              </div>
              <Card>
                <CardContent className="p-0">
                  {documents.map((document, index) => (
                    <div key={document.id}>
                      <div className="flex items-center gap-4 px-5 py-4">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-sky-400/10 text-sky-400">
                          <FileText size={18} />
                        </div>
                        <p className="min-w-0 flex-1 truncate text-sm font-medium">
                          {document.filename}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDocument(document.id)}
                        >
                          Open chat
                        </Button>
                      </div>
                      {index < documents.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )
        )}
        {error && (
          <p className="mt-5 text-center text-sm text-destructive">{error}</p>
        )}
      </section>
    </main>
  );
}
