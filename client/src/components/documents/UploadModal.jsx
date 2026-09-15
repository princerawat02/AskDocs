import { FileUp, X } from "lucide-react";
import { useRef, useState } from "react";
import { uploadDocument } from "../../services/document.api";
import { Button } from "../ui/Button";

export function UploadModal({ onClose, onUploaded }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await uploadDocument(file);
      await onUploaded();
      onClose();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add a document</h2>
            <p className="mt-1 text-sm text-slate-500">
              Upload a PDF to start a new conversation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Close upload modal"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
            <FileUp size={22} />
          </div>
          <p className="mt-4 text-sm font-bold text-slate-800">Upload a PDF</p>
          <p className="mt-1 text-sm text-slate-500">
            Drag & drop your PDF here
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={handleFile}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            or browse files
          </button>
          <p className="mt-5 text-xs text-slate-400">Maximum file size: 20MB</p>
        </div>
        {error && (
          <p className="mt-3 text-center text-sm text-red-600">{error}</p>
        )}
        <Button
          variant="secondary"
          className="mt-5 w-full"
          onClick={onClose}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Cancel"}
        </Button>
      </div>
    </div>
  );
}
