import axios from "axios";

// Instância única do Axios. A URL vem do .env (VITE_API_URL).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});