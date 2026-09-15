import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState("");

  function handleLoadSuccess({ numPages: pageCount }) {
    setNumPages(pageCount);
    setError("");
  }

  return (
    <div className="h-full overflow-y-auto bg-muted/30 p-4 sm:p-8">
      <div className="flex min-h-full flex-col items-center gap-4">
        <Document
          file={fileUrl}
          onLoadSuccess={handleLoadSuccess}
          onLoadError={() => setError("Unable to load PDF.")}
          loading={<p className="text-sm text-muted-foreground">Loading PDF...</p>}
          error={error ? <p className="text-sm text-destructive">{error}</p> : null}
        >
          {Array.from({ length: numPages || 0 }, (_, index) => (
            <Page
              key={index + 1}
              pageNumber={index + 1}
              className="bg-card shadow-sm"
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
