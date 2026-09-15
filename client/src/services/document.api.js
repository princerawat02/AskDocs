import api from "./api";

export async function getDocuments() {
  const response = await api.get("/pdf");
  return response.data;
}

export async function getDocument(documentId) {
  const response = await api.get(`/pdf/${documentId}`);
  return response.data;
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("pdf", file);
  const response = await api.post("/pdf/upload", formData);
  return response.data;
}
