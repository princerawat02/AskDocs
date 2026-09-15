import { ArrowLeft, FileText, MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { mockDocuments } from "../data/mockData";

export function Document() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const document =
    mockDocuments.find((item) => item.id === documentId) || mockDocuments[0];

  return (
    <main className="min-h-screen bg-[#f6f8fb] p-5 sm:p-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <button
          onClick={() => navigate("/app")}
          className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Back to documents
        </button>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <FileText size={27} />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          {document.name}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Uploaded {document.updated} · {document.pages} pages · {document.size}
        </p>
        <div className="mt-8 flex h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
          PDF preview will appear here
        </div>
        <button
          onClick={() => navigate(`/app/chat/${document.id}-chat`)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <MessageCircle size={16} /> New Chat
        </button>
      </div>
    </main>
  );
}
