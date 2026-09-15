import api from "./api";

export async function getChats() {
  const response = await api.get("/chat");
  return response.data;
}

export async function createChat(documentId) {
  const response = await api.post("/chat", { documentId });
  return response.data;
}

export async function getMessages(chatId) {
  const response = await api.get(`/chat/${chatId}`);
  return response.data;
}

export async function askQuestion(chatId, question) {
  const response = await api.post(`/chat/${chatId}/ask`, { question });
  return response.data;
}
