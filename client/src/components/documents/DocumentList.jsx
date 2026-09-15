import { DocumentItem } from "./DocumentItem";

export function DocumentList({ documents, selectedId }) {
  return (
    <div className="space-y-1">
      {documents.map((document) => (
        <DocumentItem
          key={document.id}
          document={document}
          selected={document.id === selectedId}
        />
      ))}
    </div>
  );
}
