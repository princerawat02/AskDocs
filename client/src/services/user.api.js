import api from "./api";

export async function getTokenLimitStatus() {
  const response = await api.get("/users/token-limit");
  return response.data;
}
